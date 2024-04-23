import { faker } from '@faker-js/faker'
var reviewText = faker.person.fullName();

describe('Testar a rota POST,  validar os usuários que farão as reviews, e criar reviews feitas por usuários', function () {

    var token;
    var idUsuario;
    var idFilme
    // Primeiro temos que montar o código referente a criação do usuário que fara as reviews dos filmes

    before(function () {
        cy.log('Usando credênciais de um usuário autorizado')
        cy.criarUsuario().then(function (userData) {
            idUsuario = userData.idUsuario
            token = userData.token
        });
        cy.fixture('filmeCriado').then(function (filme) {
            cy.request({
                method: 'POST',
                url: '/movies',
                body: filme,
                headers: {
                    Authorization: 'Bearer ' + token
                },
            }).then(function (response) {
                idFilme = response.body.id
            })
        });
    });

    // Nesta função nós deletamos sempre os usuário para não encher o banco de dados sempre que criamos um usuário // 

    after(function () {
        cy.deletarUsuario(idUsuario, token);
    });

    it('Deve ser possível criar uma review com usuário autorizado', function () {
        cy.log("Criando uma review usando um usuário autorizado!")
        cy.request({
            method: 'POST',
            url: '/users/review',
            body: {
                movieId: idFilme,
                score: 1,
                reviewText: reviewText
            },
            headers: {
                Authorization: 'Bearer ' + token
            },
        }).then(function (response) {
            expect(response.status).to.equal(201)
            expect(response.body).to.be.undefined
            // Sem verificação do Bory pois ele não esta me retornando nada, apenas um "" vazia.
        });
    });

    it('Não deve ser possível criar uma review sem o token de autorização', function () {
        cy.log("Criando uma review sem o token de autorização para retornar um erro de não autorizado (401)")
        cy.request({
            method: 'POST',
            url: '/users/review',
            body: {
                movieId: idFilme,
                score: 1,
            },
            failOnStatusCode: false
        }).then(function (response) {
            expect(response.status).to.equal(401)
            expect(response.body).to.deep.equal({
                "message": "Access denied.",
                "error": "Unauthorized",
                "statusCode": 401
            })
        });
    });

    it('Não deve ser possivel criar uma review sem o campo Movie Id preenchido', function () {
        cy.request({
            method: 'POST',
            url: '/users/review',
            body: {
                movieId: "",
                score: 1,
                reviewText: reviewText
            },
            headers: {
                Authorization: 'Bearer ' + token
            },
            failOnStatusCode: false
        }).then(function (response) {
            expect(response.status).to.equal(400)
            expect(response.body).to.deep.equal({
                "message": [
                    "movieId must be an integer number",
                    "movieId should not be empty"
                ],
                "error": "Bad Request",
                "statusCode": 400
            })
        });
    })
});



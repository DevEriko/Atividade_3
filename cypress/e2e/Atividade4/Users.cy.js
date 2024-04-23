import { faker } from '@faker-js/faker'
var reviewText = faker.person.fullName();

describe('Testar os usuários que farão as reviews. Criar uma Review. Consultar uma reviw feita por usuário', function () {

    var token;
    var idUsuario;
    var idFilme
    // Primeiro temos que montar o código referente a criação e a consulta do usuário que fara as reviews dos filmes

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

    // Nesta função nós deletamos sempre os usuário para não encher a nossa base // 

    after(function () {
        cy.log('Apenas usuários administradores podem exluir filmes')
        cy.deletarUsuario(idUsuario, token);
    })

    it('Apenas usuário autorizado poderá criar uma review', function () {
        cy.log("Review Criada!")
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

    it('Deve aparecer uma mensagem de erro (401) caso o usuário não seja autorizado', function () {
        // Lembrando que para o cadastro de filmes o usuário deve ser autorizado //
        cy.request({
            method: 'POST',
            url: '/users/review',
            body: {
                movieId: idFilme,
                score: 1,
            },
            failOnStatusCode: false
        }).then(function (response) {
            cy.log('Usuário não autorizado')
            expect(response.status).to.equal(401)
            expect(response.body).to.deep.equal({
                "message": "Access denied.",
                "error": "Unauthorized",
                "statusCode": 401
            })
        });
    });

    it('Deve aparecer erro (Bad Request - 400) ao criar uma review sem o campo Movie Id preenchido', function () {
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

    it('Verificar a lista de filmes para consulta', function () {
        let comprimentoDoArray;
        let title;
        let genre;
        let description;
        cy.request({
            method: 'GET',
            url: '/movies',
        }).then(function (response) {
            comprimentoDoArray = response.body.length - 1
            idFilme = response.body[comprimentoDoArray].id
            cy.request({
                method: 'GET',
                url: '/movies/',
                body: {
                    title: title,
                    genre: genre,
                    description: description,
                    durationInMinutes: 151,
                    releaseYear: 2015,
                },
                headers: {
                    Authorization: 'Bearer ' + token
                },
            }).then(function () {
                expect(response.status).to.equal(200)
                expect(response.body).to.be.an('Array')
            })
        })
    })
})
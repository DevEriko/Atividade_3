import { faker } from '@faker-js/faker'

var token
let filme

describe('Validar metodos de consulta de filmes', function () {
    var idUsuario;
    var token;

    //Apenas usuários administradores podem cadastrar filmes

    before(function () {
        cy.criarUsuario().then(function (userData) {
            idUsuario = userData.idUsuario
            token = userData.token
        }).as('Usuário Autorizado')
    });

    //Apenas usuários administradores podem exluir filmes depois de criados

    after(function () {
        cy.log('Apenas os usuários administradores podem excluir filmes')
        cy.deletarUsuario(idUsuario, token);
    })

    it('Apenas usuários administradores pode cadastrar filmes', function () {
        cy.log('Filme Cadastrado')
        cy.fixture('filmeCriado').then(function (filmeCriado) {
            cy.request({
                method: 'POST',
                url: '/movies',
                body: filmeCriado,
                headers: {
                    Authorization: 'Bearer ' + token
                }

                // Retorna todas as informações do filme cadastrado

            }).then(function (response) {

                expect(response.status).to.equal(201)
                expect(response.body).to.have.property('title')
                expect(response.body).to.have.property('genre')
                expect(response.body).to.have.property('description')
                expect(response.body).to.have.property('durationInMinutes')
                expect(response.body).to.have.property('releaseYear')
            });
        });
    });

    // Array = nome dado ao uma lista //

    it('Deve ser possível verificar o tipo de lista para consulta de filmes', function () {
        cy.log('Lista de Filmes')
        cy.request({
            method: 'GET',
            url: '/movies',
        }).then(function (response) {
            expect(response.status).to.equal(200)
            expect(response.body).to.be.an('array')
            const listaDeFilmes = response.body;
            filme = listaDeFilmes[listaDeFilmes.length - 1]

        });
    });

    it('Deve retornar as informações do filme consultado', function () {
        cy.log('Filme Consultado')
        cy.request({
            method: 'GET',
            url: '/movies/' + filme.id
        }).then(function (response) {
            cy.log('Informações do filme')
            expect(response.status).to.equal(200)
            expect(response.body.id).to.be.an("number")
            expect(response.body.title).to.be.an("string")
            expect(response.body.genre).to.be.an("string")
            expect(response.body.description).to.be.an("string")
            expect(response.body.durationInMinutes).to.be.an("number")
            expect(response.body.releaseYear).to.be.an("number")

        });
    });

    it('Deve ser possível consultar um filme por título', function () {
        cy.request({
            method: 'GET',
            url: '/movies/search',
            qs: { title: 'Eriko na Estrada' },
        }).then(function (response) {
            expect(response.status).to.equal(200)
            expect(response.body).to.be.an('Array')
        });
    });
});


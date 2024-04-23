import { faker } from '@faker-js/faker'
const name = faker.internet.userName()
const email = faker.internet.email()
var token
let filme
describe('Atividade 3 - Validar metodos de consulta de filmes', function () {
    var idUsuario;
    var token;
    //Apenas usuários administradores podem cadastrar filmes
    beforeEach(function () {
        cy.log('Informações do usuário autorizado')
        cy.criarUsuario().then(function (userData) {
            idUsuario = userData.idUsuario
            token = userData.token
        });
    });

    //Apenas usuários administradores podem exluir filmes depois de criados
    after(function () {
        cy.log('Apenas os usuários administradores podem excluir filmes')
        cy.deletarUsuario(idUsuario, token);
    });

    it('Somente usuário administrador pode cadastrar filmes ', function () {
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
                cy.log('Filme')
                expect(response.status).to.equal(201)
                expect(response.body).to.have.property('title')
                expect(response.body).to.have.property('genre')
                expect(response.body).to.have.property('description')
                expect(response.body).to.have.property('durationInMinutes')
                expect(response.body).to.have.property('releaseYear')
            });
        });
    });

    it('Deve ser possível verificar a lista de filmes para consulta', function () {
        cy.request({
            method: 'GET',
            url: '/movies',
        }).then(function (response) {
            expect(response.status).to.equal(200)
            expect(response.body).to.be.an('array')
            const listaDeFilmes = response.body;
            filme = listaDeFilmes[listaDeFilmes.length - 1]
            cy.log(filme)
        });
    });

    it('Deve retornar as informações do filme consultado', function () {
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
});


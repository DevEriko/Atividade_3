import { faker } from '@faker-js/faker'

const name = faker.internet.userName()
const email = faker.internet.email()
var token
describe('Atividade 3 - Validar metodos de consulta de filmes', function () {
    it('Deve consultar uma lista de filmes ', function () {
        cy.request({
            method: 'GET',
            url: '/movies',
        }).then(function (response) {
            expect(response.status).to.equal(200)
        });
    });
    before(function () {
        cy.request({
            method: 'POST',
            url: '/users',
            body: {
                "name": name,
                "email": email,
                "password": "123456"
            }
        })
        cy.request({
            method: 'POST',
            url: '/auth/login',
            body: {
                "email": email,
                "password": "123456"
            }
        }).then(function (response) {
            token = response.body.accessToken
            cy.request({
                method: "PATCH",
                url: '/users/admin',
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
            cy.request({
                method: "POST",
                url: '/movies',
                body: {
                    "title": "Missão Impossivel",
                    "genre": "Ação",
                    "description": "Missão ultramente impossivel",
                    "durationInMinutes": 160,
                    "releaseYear": 2020
                },
                headers: {
                    Authorization: 'Bearer ' + token
                }
            });
        });
    });
});

describe('Atividade 3 - Consultar um filme existente', function () {
    it('É possivel a lista de filmes ser uma ARRAY', function () {
        cy.request({
            method: 'GET',
            url: '/movies',
        }).then(function (response) {
            expect(response.body).to.be.an('array')
        })
    });
});
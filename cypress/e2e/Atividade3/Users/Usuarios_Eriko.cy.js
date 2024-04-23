import { faker } from '@faker-js/faker'
describe('Atividade 3 - Criação de usuário', function () {
    it('Deve ser criado o usuário com nome, email, password corretos', function () {
        const name = faker.person.firstName()
        const email = faker.internet.email({ firstName: name })
        const password = faker.internet.password({ length: 6 })
        cy.request({
            method: 'POST',
            url: 'https://raromdb-3c39614e42d4.herokuapp.com/api/users',
            body: {
                name: name,
                email: email,
                password: password
            }
        }).then(function (response) {
            expect(response.status).to.equal(201)
            expect(typeof response.body.id).to.equal('number')
            expect(response.body).to.deep.include({ name, email })
        });
    });

    it('Deve ser criado o usuário com o nome eriko', function () {
        const name = "Eriko"
        const email = faker.internet.email({ firstName: name })
        const password = '123456'
        cy.request({
            method: 'POST',
            url: 'https://raromdb-3c39614e42d4.herokuapp.com/api/users',
            body: {
                name: name,
                email: email,
                password: password
            }
        }).then(function (response) {
            expect(response.status).to.equal(201)
            expect(response.body.name).to.equal("Eriko")
            expect(response.body.email).to.equal(email)
        });
    });
});

describe('Atividade 3 - BAD REQUEST', function () {
    it('Deve retornar um erro ao tentar criar um usuário com email inválido', function () {
        const name = "Eriko"
        const email = "eriko.com.br"
        const password = '123456'
        cy.request({
            method: 'POST',
            url: 'https://raromdb-3c39614e42d4.herokuapp.com/api/users',
            body: {
                name: name,
                email: email,
                password: password
            },
            failOnStatusCode: false
        }).then(function (response) {
            expect(response.status).to.equal(400)
            expect(response.body.message[0]).to.equal("email must be an email")
        });
    });
});

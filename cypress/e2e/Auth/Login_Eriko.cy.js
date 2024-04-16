import { faker } from '@faker-js/faker'
describe('Atividade 3 - Autenticação de Usuário', function () {
    it('Deve ser autenticado um usuário', function () {
        const email = "usuarioeriko10@qa.com.br"
        const password = "fernando"

        cy.request({
            method: 'POST',
            url: 'https://raromdb-3c39614e42d4.herokuapp.com/api/auth/login',
            body: {
                email: email,
                password: password
            },
        }).then(function (response) {
            expect(response.status).to.equal(200)
            expect(typeof response.body.accessToken).to.equal('string')
        });
    });

    it('Deve retornar um erro 401 quando o usuário não existir', function () {
        const name = faker.person.firstName()
        const email = faker.internet.email({ firstName: name })
        const password = faker.internet.password({ length: 6 })
        cy.request({
            method: 'POST',
            url: 'https://raromdb-3c39614e42d4.herokuapp.com/api/auth/login',
            body: {
                email: email,
                password: password
            },
            failOnStatusCode: false
        }).then(function (response) {
            expect(response.status).to.equal(401)
            expect(response.body.message).to.equal("Invalid username or password.")
        });
    });
});
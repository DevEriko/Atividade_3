import { faker } from '@faker-js/faker'
describe('Atividade 3 - Testes de API com Cypress', function () {
    it('1°-> Criação e consulta de um usuário', function () {
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
});
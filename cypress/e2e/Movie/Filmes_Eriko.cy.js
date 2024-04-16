import { faker } from '@faker-js/faker'
describe('Atividade 3 - Testes de API com Cypress', function () {
    it('3°-> Consulta de filmes', function () {
        cy.request({
            method: 'GET',
            url: 'https://raromdb-3c39614e42d4.herokuapp.com/api/movies?sort=true',
        }).then(function (response) {
            expect(response.status).to.equal(200)
        });
    });
});


import { faker } from '@faker-js/faker'
describe('Atividade 3 - Consultar Filmes', function () {
    it('3°-> Deve verificar o status code da requisição', function () {
        cy.request({
            method: 'GET',
            url: 'https://raromdb-3c39614e42d4.herokuapp.com/api/movies?sort=true',
        }).then(function (response) {
            expect(response.status).to.equal(200)
        });
    });
});
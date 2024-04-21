import { faker } from '@faker-js/faker';
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })



Cypress.Commands.add('deletarUsuario', function (id, token) {
    cy.request({
        method: 'DELETE',
        url: 'users/' + id,
        headers: {
            Authorization: 'Bearer ' + token
        }
    });
});

Cypress.Commands.add('criarUsuario', function () {
    let name = faker.person.fullName();
    let email = faker.internet.email();
    let idUsuario;
    let token;
    cy.request({
        method: 'POST',
        url: '/users',
        body: {
            name: name,
            email: email,
            password: '123456'
        }
    }).then(function (response) {
        expect(response.status).to.equal(201)
        idUsuario = response.body.id
        return cy.request({
            method: 'POST',
            url: '/auth/login',
            body: {
                email: email,
                password: '123456'
            }
        }).then(function (response) {
            expect(response.status).to.equal(200)
            token = response.body.accessToken;
            cy.request({
                method: 'PATCH',
                url: '/users/admin',
                headers: {
                    Authorization: 'Bearer ' + token
                }
            }).then(function () {
                expect(response.status).to.equal(200)
                return {
                    idUsuario: idUsuario,
                    token: token
                }
            })
        });
    });
});

Cypress.Commands.add('criarFilme', function (token) {
    const title = faker.person.fullName();
    const genre = faker.person.fullName();
    const description = faker.person.fullName()

    cy.request({
        method: 'POST',
        url: '/movies',
        body: {
            title: title,
            genre: genre,
            description: description,
            durationInMinutes: 160,
            releaseYear: 2024
        },
        headers: {
            Authorization: 'Bearer ' + token
        }
    }).then(function () {
        return { titulo: title, descricao: description }
    })
});

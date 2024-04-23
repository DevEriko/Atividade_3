/// <reference types="cypress" />
import { faker } from '@faker-js/faker'


//Antes de acessarmos os filmes, criarmos o usuário que tera permissão para esta função

describe('Deve ser possível fazer a criação de filmes', function () {
  var idUsuario;
  var token;

  before(function () {
    cy.log('Usuário Autorizado')
    cy.criarUsuario().then(function (userData) {
      idUsuario = userData.idUsuario
      token = userData.token
    }).as('Usuário Autorizado')
  });

  //Somente usuários administradores podem exluir filmes depois de criados

  after(function () {
    cy.log('Apenas os usuários administradores podem excluir filmes')
    cy.deletarUsuario(idUsuario, token);
  });

  it('Deve ser possível criar um filme com dados válidos', function () {
    cy.log('Filme Criado')
    cy.fixture('filmeCriado').then(function (filmeCriado) {
      cy.request({
        method: 'POST',
        url: '/movies',
        body: filmeCriado,
        headers: {
          Authorization: 'Bearer ' + token
        }
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

  it('Deve apresentar um erro ao tentar colocar número no campo Genero', function () {
    cy.request({
      method: 'POST',
      url: '/movies',
      body: {
        "title": "Eriko na Estrada",
        "genre": 300,
        "description": "Trilogia",
        "durationInMinutes": 160,
        "releaseYear": 2024
      },
      headers: {
        Authorization: 'Bearer ' + token
      },
      failOnStatusCode: false
    }).then(function (response) {
      expect(response.status).to.equal(400)
      expect(response.body).to.deep.equal({
        "message": [
          "genre must be longer than or equal to 1 and shorter than or equal to 100 characters",
          "genre must be a string"
        ],
        "error": "Bad Request",
        "statusCode": 400
      });
    });
  });

  it('Não é possível usar número no campo título', function () {
    cy.request({
      method: 'POST',
      url: '/movies',
      body: {
        "title": 2,
        "genre": 'Ação',
        "description": "Trilogia",
        "durationInMinutes": 160,
        "releaseYear": 2024
      },
      headers: {
        Authorization: 'Bearer ' + token
      },
      failOnStatusCode: false
    }).then(function (response) {
      expect(response.status).to.equal(400)
      expect(response.body).to.deep.equal({
        "message": [
          "title must be longer than or equal to 1 and shorter than or equal to 100 characters",
          "title must be a string"
        ],
        "error": "Bad Request",
        "statusCode": 400
      });
    });
  });

  it('Não é possível usar apenas número na descrição do filme', function () {
    cy.request({
      method: 'POST',
      url: '/movies',
      body: {
        "title": 'Eriko na Estrada',
        "genre": 'Ação',
        "description": 2,
        "durationInMinutes": 160,
        "releaseYear": 2024
      },
      headers: {
        Authorization: 'Bearer ' + token
      },
      failOnStatusCode: false
    }).then(function (response) {
      expect(response.status).to.equal(400)
      expect(response.body).to.deep.equal({
        "message": [
          "description must be longer than or equal to 1 and shorter than or equal to 500 characters",
          "description must be a string"
        ],
        "error": "Bad Request",
        "statusCode": 400
      });
    });
  });
});


describe('Deve ser possível fazer atualização de filmes', function () {
  let idUsuario;
  let token;
  let titulo;
  let descricao;
  let comprimentoDoArray;
  let idFilme;
  let tituloNovo = faker.person.fullName();
  let generoNovo = faker.person.fullName();
  let descricaoNova = faker.person.fullName();
  before(function () {
    cy.criarUsuario().then(function (userData) {
      idUsuario = userData.idUsuario
      token = userData.token
    }).then(function () {
      cy.criarFilme(token).then(function (filmedata) {
        titulo = filmedata.titulo
        descricao = filmedata.descricao
      });
    });
  });

  it('Atualizar um filme por Id', function () {
    cy.request({
      method: 'GET',
      url: '/movies',
    }).then(function (response) {
      comprimentoDoArray = response.body.length - 1
      idFilme = response.body[comprimentoDoArray].id
      cy.request({
        method: 'PUT',
        url: '/movies/' + idFilme,
        body: {
          title: tituloNovo,
          genre: generoNovo,
          description: descricaoNova,
          durationInMinutes: 151,
          releaseYear: 2015,
        },
        headers: {
          Authorization: 'Bearer ' + token
        }
      }).then(function () {
        cy.request({
          method: 'GET',
          url: '/movies/' + idFilme
        }).then(function (response) {
          expect(response.body).to.includes({
            title: tituloNovo,
            genre: generoNovo,
            description: descricaoNova,
            durationInMinutes: 151,
            releaseYear: 2015,
          });
        });
      });
    });
  });
});



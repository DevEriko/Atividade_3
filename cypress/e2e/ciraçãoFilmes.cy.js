import { faker } from '@faker-js/faker'

describe('Atividade 4 - Criação de um usuário Administrador para criar filmes', function () {
  var idUsuario;
  var token;
  before(function () {
    cy.criarUsuario().then(function (userData) {
      idUsuario = userData.idUsuario
      token = userData.token
    })
  })

  after(function () {
    cy.deletarUsuario(idUsuario, token);
  });

  it('Deve criar um filme com dados válidos', function () {
    const title = faker.person.fullName();
    const genre = faker.person.fullName();
    const description = faker.person.fullName()
    let comprimentoDoArray
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
    }).then(function (response) {
      expect(response.status).to.equal(201)
      cy.request({
        method: 'GET',
        url: '/movies',
      }).then(function (response) {
        comprimentoDoArray = response.body.length - 1
        expect(response.body[comprimentoDoArray]).to.include({
          title: title,
          genre: genre,
          description: description,
          durationInMinutes: 160,
          releaseYear: 2024
        })
        expect(response.body[comprimentoDoArray].title).to.equal(title)
      })
    });
  });
});

describe('Atividade - 4, Editando um filme por Id', function () {
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
      })
    })
  })
  it('Atualizar um cadastro de um filme', function () {
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
        cy.log(idFilme)
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
          })
        })
      })
    })
  })
})


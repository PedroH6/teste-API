/// <reference types="cypress" />
const usuarioSchema = require("../contratos/usuarios.contratos.js");

describe("Teste de API - Usuários", () => {
  it("Deve validar contrado de usuários", () => {
    cy.request("usuarios").then((response) => {
      return usuarioSchema.validateAsync(response.body);
    });
  });

  it("Deve listar usuários cadastrados", () => {
    cy.request({
      method: "GET",
      url: "usuarios",
    }).should((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("usuarios");
    });
  });

  it("Deve cadastrar um usuário com sucesso", () => {
    let nome = `Usuário EBAC ${Math.floor(Math.random() * 1000000000)}`;
    let email = `ebac${Math.floor(Math.random() * 1000000000)}@teste.com.br`;
    let senha = "teste";
    let administrador = "true";
    cy.request({
      method: "POST",
      url: "usuarios",
      body: {
        nome: nome,
        email: email,
        password: senha,
        administrador: administrador,
      },
    }).then((response) => {
      expect(response.status).to.equal(201);
      expect(response.body.message).to.equal("Cadastro realizado com sucesso");
    });
  });

  it("Deve validar um usuário com email inválido", () => {
    cy.cadastrarUsuario(
      "Usuário falso",
      "emailinvalido.com.br",
      "teste",
      "true"
    ).then((response) => {
      expect(response.status).to.equal(400);
      expect(response.body.email).to.equal("email deve ser um email válido");
    });
  });

  it('Deve iditar um usuário previamente cadastrado', () => {
    cy.request('usuarios').then((response) => {
      let id = response.body.usuarios[0]._id
      cy.request({
        method: 'PUT',
        url: `usuarios/${id}`,
        body: {
          nome: "Usuário Editado",
          email: `ebac${Math.floor(Math.random() * 1000000000)}@teste.com.br`,
          password: "teste",
          administrador: "true"
        }
      }).then((response) => {
        expect(response.status).to.equal(200)
        expect(response.body.message).to.equal('Registro alterado com sucesso')
      })
    })
  });
});

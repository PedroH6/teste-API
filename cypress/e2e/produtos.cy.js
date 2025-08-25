/// <reference types="cypress"/>
import contratoProdutos from '../contratos/produtos.contratos.js';

describe("Teste de API - Produtos", () => {
  let token;
  beforeEach(() => {
    cy.token("fulano@qa.com", "teste").then((tkn) => {
      token = tkn;
    });
  });

  it.only('Deve validar contrato de produtos com sucesso', () => {
    cy.request('produtos').then((response) => { 
      return contratoProdutos.validateAsync(response.body)
    })
  });

  it("Deve listar produtos com sucesso - GET", () => {
    cy.request({
      method: "GET",
      url: "produtos",
    }).should((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("produtos");
    });
  });

  it("Deve cadastrar produto com sucesso - POST", () => {
    let produto = "Produto EBAC" + Math.floor(Math.random() * 1000000000);
    cy.cadastrarProduto(token, produto, 10, "Cabo USB C", 100).should(
      (response) => {
        expect(response.status).equal(201);
        expect(response.body.message).equal("Cadastro realizado com sucesso");
      }
    );
  });

  it("Deve validar mensagem de produto cadastrodo anteriomente - POST", () => {
    cy.cadastrarProduto(token, "Cabo USB 001", 10, "Cabo USB C", 100).should(
      (response) => {
        expect(response.status).equal(400);
        expect(response.body.message).equal("Já existe produto com esse nome");
      }
    );
  });

  it("Deve editar um produto com sucesso - PUT", () => {
    let produto =
      "Produto EBAC EDITADO" + Math.floor(Math.random() * 1000000000);
    cy.cadastrarProduto(token, produto, 10, "Produto EBAC Editado", 100).then(
      (response) => {
        let id = response.body._id;
        cy.request({
          method: "PUT",
          url: `produtos/${id}`,
          headers: {
            authorization: token,
          },
          body: {
            nome: produto,
            preco: 10,
            descricao: "Cabo USB C",
            quantidade: 100,
          },
        }).should((response) => {
          expect(response.status).to.equal(200);
          expect(response.body.message).to.equal(
            "Registro alterado com sucesso"
          );
        });
      }
    );
  });

  it("Deve deletar um produto com sucesso - DELETE", () => {
    cy.cadastrarProduto(
      token,
      "Produto para deletar",
      10,
      "Cabo USB C",
      100
    ).then((response) => {
      let id = response.body._id;
      cy.request({
        method: "DELETE",
        url: `produtos/${id}`,
        headers: {
          authorization: token,
        },
      }).should((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal("Registro excluído com sucesso");
      });
    });
  });
});

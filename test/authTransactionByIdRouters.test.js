const request = require("supertest");
const jwt = require("jsonwebtoken");
const baseURL = "http://localhost:3004";

require("dotenv").config();
const secret = process.env.PGSECUREKEY;

let token;
let user_id = 71;
let category_id = 14;
let tempTransactionId;

describe("Testes da rota /auth/transacao/{id}", () => {
  beforeAll(async () => {
    token = createToken(71, "1m");
  });

  describe("GET /auth/transacao/{id}", () => {
    it("Must register new transaction for the user and return code 201", async () => {
      const newTransaction = {
        descricao: "Nova transação",
        valor: 15000,
        data: new Date(),
        categoria_id: category_id,
        tipo: "saida",
      };
      const res = await request(baseURL).post("/auth/transacao").send(newTransaction).set("Authorization", `Bearer ${token}`).expect(201);
      expect(res.body.descricao).toBe(newTransaction.descricao);
      expect(res.body.valor).toBe(newTransaction.valor);
      expect(res.body.categoria_id).toBe(newTransaction.categoria_id);
      expect(res.body.tipo).toBe(newTransaction.tipo);
      expect(res.body.usuario_id).toBe(user_id);

      tempTransactionId = res.body.id;
    });

    it("Must return an existing transaction", async () => {
      const response = await request(baseURL).get(`/auth/transacao/${tempTransactionId}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(tempTransactionId);
      expect(response.body.descricao).toBe("Nova transação");
      expect(response.body.valor).toBe(15000);
      expect(response.body.usuario_id).toBe(user_id);
      expect(response.body.categoria_id).toBe(category_id);
      expect(response.body.tipo).toBe("saida");
    });

    it("Deve retornar um erro 404 para uma transação inexistente", async () => {
      await notFoundedTransactionException();
    });

    it("Deve retornar erro 401 quando não for enviado token de autenticação", async () => {
      await withoutTokenException();
    });

    it("Deve retornar erro 419 quando o token de autenticação estiver expirado", async () => {
      await expiredTokenException();
    });
  });

  describe("PUT /auth/transacao/{id}", () => {
    it("You must update an existing transaction", async () => {
      const requestBody = {
        descricao: "Sapato amarelo",
        valor: 15800,
        data: "2022-03-23T12:35:00.000Z",
        categoria_id: 4,
        tipo: "saida",
      };

      const response = await request(baseURL).put(`/auth/transacao/${tempTransactionId}`).send(requestBody).set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(204);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const getResponse = await request(baseURL).get(`/auth/transacao/${tempTransactionId}`).set("Authorization", `Bearer ${token}`);

      expect(getResponse.status).toBe(200);
      expect(getResponse.body.id).toBe(tempTransactionId);
      expect(getResponse.body.descricao).toBe("Sapato amarelo");
      expect(getResponse.body.valor).toBe(15800);
      expect(getResponse.body.usuario_id).toBe(user_id);
      expect(getResponse.body.categoria_id).toBe(4);
      expect(getResponse.body.tipo).toBe("saida");
    });

    it("Should return a 404 error for a non-existent transaction", async () => {
      const requestBody = {
        descricao: "Sapato amarelo",
        valor: 15800,
        data: "2022-03-23T12:35:00.000Z",
        categoria_id: 4,
        tipo: "saida",
      };

      const response = await request(baseURL).put("/auth/transacao/999").send(requestBody).set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.mensagem).toBe("Transação informada não encontrada.");
    });

    it("Must return error 401 when no authentication token is sent", async () => {
      await withoutTokenException();
    });

    it("Should return error 419 when the authentication token is expired", async () => {
      await expiredTokenException();
    });
  });

  describe("DELETE /auth/transacao/{id}", () => {
    it("Deve excluir uma transação existente", async () => {
      const response = await request(baseURL).delete(`/auth/transacao/${tempTransactionId}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(204);
    });

    it("Should return a 404 error for a non-existent transaction", async () => {
      await notFoundedTransactionException();
    });

    it("Must return error 401 when no authentication token is sent", async () => {
      await withoutTokenException();
    });

    it("Should return error 419 when the authentication token is expired", async () => {
      await expiredTokenException();
    });
  });
});

function createToken(id, expiresIn) {
  const token = jwt.sign({ id }, secret, { expiresIn });
  return token;
}

async function expiredTokenException() {
  const expiredToken = createToken(71, "2ms");
  const response = await request(baseURL).get("/auth/usuario").set("Authorization", `Bearer ${expiredToken}`);

  expect(response.status).toBe(419);
  expect(response.body).toHaveProperty("mensagem", "Autorização expirada.");
}

async function withoutTokenException() {
  const response = await request(baseURL).put("/auth/usuario").send({
    nome: "teste",
    email: "obaoba@email.com",
    senha: "123456",
  });

  expect(response.status).toBe(401);
  expect(response.body).toHaveProperty("mensagem", "Para acessar este recurso um token de autenticação válido deve ser enviado.");
}

async function notFoundedTransactionException() {
  const response = await request(baseURL).get("/auth/transacao/999").set("Authorization", `Bearer ${token}`);

  expect(response.status).toBe(404);
  expect(response.body.mensagem).toBe("Transação informada não encontrada.");
}

const request = require("supertest");
const jwt = require("jsonwebtoken");
const baseURL = "http://localhost:3004";

require("dotenv").config();
const secret = process.env.PGSECUREKEY;

describe("Testes para a rota /auth/transacao", () => {
  let token;
  let user_id = 71;
  let category_id = 14;
  let tempTransactionId;

  beforeAll(async () => {
    token = createToken(71, "1m");
  });

  afterAll(async () => {
    await request(baseURL).delete(`/auth/transacao/${tempTransactionId}`).set("Authorization", `Bearer ${token}`);
  });

  it("Should list all user transactions and return code 200", async () => {
    const res = await request(baseURL).get("/auth/transacao").set("Authorization", `Bearer ${token}`).expect(200);
    expect(res.body).toBeInstanceOf(Array);
  });

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

  it("Must fail when registering a new transaction without informing required fields and return code 400", async () => {
    const novaTransacao = {
      descricao: "Nova transação",
      data: new Date(),
      categoria_id: category_id,
      tipo: "saida",
    };
    const res = await request(baseURL).post("/auth/transacao").send(novaTransacao).set("Authorization", `Bearer ${token}`).expect(400);
    expect(res.body).toHaveProperty("mensagem");
    expect(res.body.mensagem).toBe("Dados inválidos");
    expect(res.body).toHaveProperty("erros");
    expect(res.body.erros).toBeInstanceOf(Array);
  });

  it("Must return error 401 when no authentication token is sent", async () => {
    await withoutTokenException();
  });

  it("Should return error 419 when the authentication token is expired", async () => {
    await expiredTokenException();
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

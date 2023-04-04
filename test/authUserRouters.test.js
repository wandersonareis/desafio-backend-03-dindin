const request = require("supertest");
const jwt = require("jsonwebtoken");
const baseURL = "http://localhost:3004";

require("dotenv").config();
const secret = process.env.PGSECUREKEY;

const createToken = (id, expiresIn) => {
  const token = jwt.sign({ id }, secret, { expiresIn });
  return token;
};

describe("GET /auth/usuario", () => {
  let token;

  beforeAll(async () => {
    token = createToken(71, "1m");
  });

  it("Deve retornar os dados do usuário autenticado", async () => {
    const response = await request(baseURL).get("/auth/usuario").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("nome", "teste");
    expect(response.body).toHaveProperty("email", "teste@email.com");
  });

  it("Deve retornar erro 401 quando não for enviado token de autenticação", async () => {
    const response = await request(baseURL).get("/auth/usuario");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("mensagem", "Para acessar este recurso um token de autenticação válido deve ser enviado.");
  });

  it("Deve retornar erro 419 quando o token de autenticação estiver expirado", async () => {
    await expiredTokenException();
  });
});

describe("PUT /auth/usuario", () => {
  let token;
  let userId = 71;

  beforeAll(async () => {
    token = createToken(71, "1m");
  });

  afterAll(async () => {
    await request(baseURL).put("/auth/usuario").set("Authorization", `Bearer ${token}`).send({
      nome: "teste",
      email: "teste@email.com",
      senha: "123456",
    });
  });

  it("Deve atualizar os dados do usuário e retornar código 204", async () => {
    const response = await request(baseURL).put("/auth/usuario").set("Authorization", `Bearer ${token}`).send({
      nome: "teste2",
      email: "teste@email.com",
      senha: "123456",
    });

    expect(response.status).toBe(204);

    const updatedUserDataResponse = await request(baseURL).get("/auth/usuario").set("Authorization", `Bearer ${token}`);

    expect(updatedUserDataResponse.body.id).toBe(userId);
    expect(updatedUserDataResponse.body.nome).toBe("teste2");
  });

  it("Deve retornar erro 400 quando o e-mail informado já está cadastrado", async () => {
    const response = await request(baseURL).put("/auth/usuario").set("Authorization", `Bearer ${token}`).send({
      nome: "teste",
      email: "obaoba@email.com",
      senha: "123456",
    });

    expect(response.status).toBe(400);

    expect(response.body).toHaveProperty("mensagem", "O e-mail informado já está sendo utilizado por outro usuário.");
  });

  it("Deve retornar erro 401 quando não for enviado token de autenticação", async () => {
    const response = await request(baseURL).put("/auth/usuario").send({
      nome: "teste",
      email: "obaoba@email.com",
      senha: "123456",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("mensagem", "Para acessar este recurso um token de autenticação válido deve ser enviado.");
  });

  it("Deve retornar erro 419 quando o token de autenticação estiver expirado", async () => {
    await expiredTokenException();
  });
});

const expiredTokenException = async () => {
  const expiredToken = createToken(71, "2ms");
  const response = await request(baseURL).get("/auth/usuario").set("Authorization", `Bearer ${expiredToken}`);

  expect(response.status).toBe(419);
  expect(response.body).toHaveProperty("mensagem", "Autorização expirada.");
};

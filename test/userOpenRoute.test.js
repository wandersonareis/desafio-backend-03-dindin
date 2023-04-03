const request = require("supertest");
const baseURL = "http://localhost:3004";

describe("POST /usuario", () => {
  const usuario = {
    nome: "João",
    email: "joao@example.com",
    senha: "senha123",
  };

  test("Must create a new user", async () => {
    const response = await request(baseURL).post("/usuario").send(usuario).expect("Content-Type", /json/).expect(201);

    expect(response.body).toMatchObject({
      id: expect.any(Number),
      nome: usuario.nome,
      email: usuario.email,
    });
  });

  test("Should return error 400 when the e-mail is already registered", async () => {
    const response = await request(baseURL).post("/usuario").send(usuario).expect("Content-Type", /json/).expect(400);

    expect(response.body).toMatchObject({
      mensagem: "O e-mail informado já está sendo utilizado por outro usuário.",
    });
  });
});

describe("POST /login", () => {
  it("Must authenticate a user with valid credentials", async () => {
    const usuario = {
      email: "joao@example.com",
      senha: "senha123",
    };

    const response = await request(baseURL).post("/login").send(usuario);

    expect(response.status).toBe(200);
    expect(response.body.usuario).toHaveProperty("id");
    expect(response.body.usuario).toHaveProperty("nome", "João");
    expect(response.body.usuario).toHaveProperty("email", "joao@example.com");
    expect(response.body).toHaveProperty("token");
  });

  it("Should return error 400 when credentials are invalid", async () => {
    const usuario = {
      email: "joao@example.com",
      senha: "senhaerrada",
    };

    const response = await request(baseURL).post("/login").send(usuario);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      mensagem: "Usuário e/ou senha inválido(s).",
    });
  });
});

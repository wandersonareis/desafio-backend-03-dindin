const request = require("supertest");
const baseURL = "http://localhost:3004";

describe("POST /usuario", () => {
  const userCreate = {
    nome: "João",
    email: "joao@example.com",
    senha: "senha123",
  };

  it("Must create a new user", async () => {
    const response = await request(baseURL).post("/usuario").send(userCreate).expect("Content-Type", /json/).expect(201);

    expect(response.body).toMatchObject({
      id: expect.any(Number),
      nome: userCreate.nome,
      email: userCreate.email,
    });
  });

  it("Should return error 400 when the e-mail is already registered", async () => {
    const response = await request(baseURL).post("/usuario").send(userCreate).expect("Content-Type", /json/).expect(400);

    expect(response.body).toMatchObject({
      mensagem: "O e-mail informado já está sendo utilizado por outro usuário.",
    });
  });

  it("Should return error 400 when the name field is mandatory", async () => {
    const { nome, ...userWithoutName } = userCreate;
    const response = await request(baseURL).post("/usuario").send(userWithoutName).expect("Content-Type", /json/).expect(400);

    expect(response.body).toMatchObject({
      mensagem: "Dados inválidos",
      erros: ["O campo nome é obrigatório"],
    });
  });

  it("Should return error 400 when the email field is mandatory", async () => {
    await emailExistsException("/usuario", userCreate);
  });

  it("Should return error 400 when the password field is mandatory", async () => {
    await passwordExistsException("/usuario", userCreate);
  });

  it("Should return error 400 when body is json valid but empty", async () => {
    const empty = {};
    const response = await request(baseURL).post("/usuario").send(empty).expect("Content-Type", /json/).expect(400);

    expect(response.body).toMatchObject({
      mensagem: "Dados inválidos",
      erros: ["O campo nome é obrigatório", "O campo email é obrigatório", "O campo senha é obrigatório"],
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

const emailExistsException = async (rota, userLogin) => {
  const { email, ...userWithoutEmail } = userLogin;
  const response = await request(baseURL).post(rota).send(userWithoutEmail).expect("Content-Type", /json/).expect(400);

  expect(response.body).toMatchObject({
    mensagem: "Dados inválidos",
    erros: ["O campo email é obrigatório"],
  });
};

const passwordExistsException = async (rota, userLogin) => {
  const { senha, ...userWithoutPassword } = userLogin;
  const response = await request(baseURL).post(rota).send(userWithoutPassword).expect("Content-Type", /json/).expect(400);

  expect(response.body).toMatchObject({
    mensagem: "Dados inválidos",
    erros: ["O campo senha é obrigatório"],
  });
};

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const routers = require("./routers");
const { errorHandler } = require("./middleware");
const port = process.env.SVRPORT || 3004;

const app = express();

app.use(cors());

app.use(express.json());
app.use((err, req, res, next) => {
  const ErrorHandler = require("./middleware/errorHandling/errorHandler.class");

  if (err instanceof SyntaxError && err.status === 400) {
    const error = new ErrorHandler("O corpo da requisição é inválido. Verifique os dados enviados e tente novamente.", 400);
    return next(error);
  }

  next();
});

app.use(routers);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Api running at http://localhost:${port}`);
});

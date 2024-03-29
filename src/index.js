const express = require("express");
const { executeTransaction } = require("./services/transactions");
const { obtainUserStatement } = require("./services/statement");
const ApiError = require("./errors/apiError");
const ErrorHandler = require("./middleware/errorHandler");
const app = express();
const port = 3000;

app.use(express.json());

app.get("/clientes/:id/extrato", async (req, res, next) => {
  const { id } = req.params;
  try {
    const statement = await obtainUserStatement(id);

    res.json(statement);
  } catch (error) {
    if (error.message === "user_not_found") {
      return next(ApiError({ message: "user_not_found", statusCode: 404 }));
    }

    next(error);
  }
});

app.post("/clientes/:id/transacoes", async (req, res, next) => {
  const body = req.body;
  const { id } = req.params;

  if (body.valor == null || body.valor < 0 || !Number.isInteger(body.valor)) {
    return next(ApiError({ message: "Valor inválido", statusCode: 422 }));
  }

  if (
    body.descricao == null ||
    body.descricao == "" ||
    body.descricao.length < 0 ||
    body.descricao.length > 10
  ) {
    return next(ApiError({ message: "Descricão inválida", statusCode: 422 }));
  }

  if (body.tipo !== "c" && body.tipo !== "d") {
    return next(ApiError({ message: "Tipo inválido", statusCode: 422 }));
  }
  try {
    const createdTransaction = await executeTransaction(id, body);
    res.json(createdTransaction);
  } catch (error) {
    if (error.message === "user_not_found") {
      return next(ApiError({ message: "user_not_found", statusCode: 404 }));
    }

    if (error.message === "limit_exceeded") {
      return next(ApiError({ message: "limit_exceeded", statusCode: 422 }));
    }

    next(error);
  }
});

app.use(ErrorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

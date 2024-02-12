const express = require("express");
const { createTransaction } = require("./services/transactions");
const app = express();
const port = 3000;

app.use(express.json());

app.get("/clientes/:id/extrato", (req, res) => {
  const { id } = req.params;
	try {
		const statement = obtainUserStatement(id);
		res.json(statement)
	} catch (error) {
		if (error.message === "user_not_found") {
			return res.status(404).json({
				message: "user_not_found",
			});
		}
		return res.status(500).json({
			message: "internal_error",
		})
	}
});

app.post("/clientes/:id/transacoes", (req, res) => {
  const body = req.body;
  const { id } = req.params;

  if (body.valor == null || body.valor < 0 || !Number.isInteger(body.valor)) {
    return res.status(422).json({
      message: "Valor inválido",
    });
  }

  if (
    body.descricao == null ||
    body.descricao == "" ||
    body.descricao.length < 0 ||
    body.descricao.length > 10
  ) {
    return res.status(422).json({
      message: "Descricão inválida",
    });
  }

  if (body.tipo !== "c" && body.tipo !== "d") {
    return res.status(422).json({
      message: "Tipo inválido",
    });
  }

  const createdTransaction = createTransaction(body);

  

  res.json(createdTransaction)
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

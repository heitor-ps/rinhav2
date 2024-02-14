const db = require("../db/db");

async function obtainUserStatement(id) {
  const user = await db.getUser(id);

  if (user == null) {
    throw new Error("user_not_found");
  }

  const transactions = (await db.getUserTransactions(id)) || [];

  return {
    saldo: {
      total: user.balance,
      limite: user.limit,
      data_extrato: new Date().toISOString(),
    },
    ultimas_transacoes: [
      ...transactions.map(({description, type, value}) => {
        return {
          descricao: description,
          tipo: type,
          valor: value,
        };
      }),
    ],
  };
}

module.exports = {
  obtainUserStatement,
};

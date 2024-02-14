const db = require("../db");

async function obtainUserStatement(id) {
  try {
  const user = await db.getUser(id);

  if (user == null) {
    throw new Error("user_not_found");
  }

  const transactions = await db.getUserTransactions(id) || [];

  return {
    saldo: {
      total: user.balance,
      limite: user.limit,
      data_extrato: new Date().toISOString(),
    },
    ultimas_transacoes: [...transactions],
  };

  } finally {
    db.releaseConnection();
  }
}

module.exports = {
  obtainUserStatement,
};

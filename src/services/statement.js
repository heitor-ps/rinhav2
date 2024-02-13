const { getUser, getUserTransactions } = require("../db");

async function obtainUserStatement(id) {
  const user = await getUser(id);

  if (user == null) {
    throw new Error("user_not_found");
  }

  const transactions = await getUserTransactions(id) || [];

  return {
    saldo: {
      total: user.balance,
      limite: user.limit,
      data_extrato: new Date().toISOString(),
    },
    ultimas_transacoes: [...transactions],
  };
}

module.exports = {
  obtainUserStatement,
};

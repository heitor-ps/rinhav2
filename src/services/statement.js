const { getUser, getUserTransactions } = require("../db");

function obtainUserStatement(id) {
  const user = getUser(id);

  if (user == null) {
    throw new Error("user_not_found");
  }

  const transactions = getUserTransactions(id);

  return {
    saldo: {
      total: 0,
      limite: 0,
      data_extrato: new Date().toISOString(),
    },
    ultimas_transacoes: [...transactions],
  };
}

module.exports = {
  obtainUserStatement,
};

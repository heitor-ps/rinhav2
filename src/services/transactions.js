const { createTransaction, getUser } = require("../db");

function executeTransaction(transactionRequest) {
  const { descricao, tipo, valor, id } = transactionRequest;

  const userData = getUser(id);

  console.log(userData);






  // const transaction = createTransaction({
  //   userId: id,
  //   type: tipo,
  //   value: valor,
  //   description: descricao,
  // });

  return {
    limite: 1000,
    saldo: 1000,
  };
}

module.exports = {
  executeTransaction,
};

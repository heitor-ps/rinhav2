const 
  db
 = require("../db");

async function executeTransaction(id, transactionData) {
  try {
    db.beginTransaction();
    const { descricao, tipo, valor } = transactionData;

    const userData = await db.getUser(id);
    const { balance, limit } = userData;

    if (userData == null) {
      throw new Error("user_not_found");
    }

    let newBalance = 0;

    if (tipo == "d") {
      newBalance = balance - valor;
    } else {
      newBalance = balance + valor;
    }

    if (Math.abs(newBalance) > limit) {
      throw new Error("limit_exceeded");
    }

    await db.createTransaction({
      userId: id,
      type: tipo,
      value: valor,
      description: descricao,
      newBalance: newBalance,
    });

    await db.commitTransaction();

    return {
      limite: limit,
      saldo: newBalance,
    };
  } catch (e) {
    await db.rollbackTransaction();
    throw e;
  } finally {
    db.releaseConnection();
  }
}

module.exports = {
  executeTransaction,
};

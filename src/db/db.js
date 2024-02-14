const pool = require("./pool");

async function getUser(id) {
  const res = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return res.rows[0];
}

async function createTransaction(transactionRequest) {
  await pool.query("UPDATE users SET balance = $1 WHERE id = $2", [
    transactionRequest.newBalance,
    transactionRequest.userId,
  ]);

  await pool.query(
    "INSERT INTO transactions (user_id, type, value, description, created) VALUES ($1, $2, $3, $4, $5)",
    [
      transactionRequest.userId,
      transactionRequest.type,
      transactionRequest.value,
      transactionRequest.description,
      new Date().toISOString(),
    ]
  );
}

async function getUserTransactions(id) {
  const res = await pool.query(
    "SELECT * FROM transactions WHERE user_id = $1 ORDER BY id DESC LIMIT 10",
    [id]
  );
  return res.rows;
}

module.exports = {
  getUser,
  createTransaction,
  getUserTransactions,
};

async function connect() {
  if (global.connection) return global.connection.connect();

  const { Pool } = require("pg");
  const pool = new Pool({
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "clients",
    password: process.env.DB_PASS || "postgres",
    port: process.env.DB_PORT || 5432,
  });

  //guardando para usar sempre o mesmo
  global.connection = pool;
  return pool.connect();
}

async function query(sql, params) {
  const client = await connect();
  const res = await client.query(sql, params);
  return res;
}

async function getUser(id) {
  const res = await query("SELECT * FROM users WHERE id = $1", [id]);
  return res.rows[0];
}

async function createTransaction(transactionRequest) {
  await query(
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
  const res = await query(
    "SELECT * FROM transactions WHERE user_id = $1 ORDER BY id DESC LIMIT 10",
    [id]
  );
  return res.rows;
}

async function updateUserBalance(id, balance) {
  await query("UPDATE users SET balance = $1 WHERE id = $2", [balance, id]);
}

module.exports = {
  getUser,
  createTransaction,
  getUserTransactions,
  updateUserBalance,
  connect,
};

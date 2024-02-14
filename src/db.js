async function connect() {
  if (global.connection) return global.connection.connect();

  const { Pool } = require("pg");
  const pool = new Pool({
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "clients",
    password: process.env.DB_PASS || "postgres",
    port: process.env.DB_PORT || 5432,
    max: 100,
    idleTimeoutMillis: 1000,
    connectionTimeoutMillis: 5000,
  });

  //guardando para usar sempre o mesmo
  global.connection = pool;
  return pool.connect();
}

async function query(sql, params) {
  const pool = await connect();
  const res = await pool.query(sql, params);
  return res;
}

async function getUser(id) {
  const res = await query("SELECT * FROM users WHERE id = $1", [id]);
  return res.rows[0];
}

async function createTransaction(transactionRequest) {
  const queryInsertText =
    "INSERT INTO transactions (user_id, type, value, description, created) VALUES ($1, $2, $3, $4, $5)";

  await query(queryInsertText, [
    transactionRequest.userId,
    transactionRequest.type,
    transactionRequest.value,
    transactionRequest.description,
    new Date().toISOString(),
  ]);

  const updateQuery = "UPDATE users SET balance = $1 WHERE id = $2";

  await query(updateQuery, [
    transactionRequest.newBalance,
    transactionRequest.userId,
  ]);
}

async function getUserTransactions(id) {
  const res = await query(
    "SELECT * FROM transactions WHERE user_id = $1 ORDER BY id DESC LIMIT 10",
    [id]
  );
  return res.rows;
}

async function beginTransaction() {
  await query("BEGIN");
}

async function commitTransaction() {
  await query("COMMIT");
}

async function releaseConnection() {
  (await connect()).release();
}

async function rollbackTransaction() {
  await query("ROLLBACK");
}

module.exports = {
  getUser,
  createTransaction,
  getUserTransactions,
  connect,
  beginTransaction,
  commitTransaction,
  rollbackTransaction,
  releaseConnection
};

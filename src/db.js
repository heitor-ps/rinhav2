async function connect() {
  if (global.connection) return global.connection.connect();

  const { Pool } = require("pg");
  const pool = new Pool({
    connectionString: process.env.CONNECTION_STRING,
  });

  //apenas testando a conexão
  const client = await pool.connect();
  console.log("Criou pool de conexões no PostgreSQL!");

  const res = await client.query("SELECT NOW()");
  console.log(res.rows[0]);
  client.release();

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
    "INSERT INTO transactions (userId, type, value, description) VALUES ($1, $2, $3, $4)",
    [
      transactionRequest.userId,
      transactionRequest.type,
      transactionRequest.value,
      transactionRequest.description,
    ]
  );
}

async function getUserTransactions(id) {
  const res = await query(
    "SELECT * FROM transactions WHERE userId = $1 ORDER BY id DESC LIMIT 10",
  )
  return res.rows;
}

async function updateUserBalance(id, balance) {
  await query("UPDATE users SET balance = $1 WHERE id = $2", [balance, id]);
}

module.exports = {
  getUser,
  createTransaction,
  getUserTransactions,
  updateUserBalance
};

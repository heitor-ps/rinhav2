function createPool() {
  if (global.connection) return global.connection;

  const { Pool } = require("pg");
  const pool = new Pool({
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "clients",
    password: process.env.DB_PASS || "postgres",
    port: process.env.DB_PORT || 5432,
    min: 3,
    max: 20,
  });

  //guardando para usar sempre o mesmo
  global.connection = pool;
  return pool;
}

module.exports = createPool()
const sql = require('mssql');
require('dotenv').config();

const dbSettings = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT) || 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

// Este pool se conecta una sola vez y se reutiliza
const poolPromise = new sql.ConnectionPool(dbSettings)
  .connect()
  .then(pool => {
    console.log('✅ Conexión a SQL Server establecida');
    return pool;
  })
  .catch(err => {
    console.error('❌ Error al conectar con la base de datos:', err);
    throw err;
  });

module.exports = { sql, poolPromise };

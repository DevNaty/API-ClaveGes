const sql = require('mssql');
const { poolPromise } = require('../db');

async function crearOcupacionVinculo(datos) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('ID_Ocupacion', sql.Int, datos.ID_Ocupacion)
    .input('ID_Vinculo', sql.Int, datos.ID_Vinculo)
    .query(`
      INSERT INTO OCUPACIONES_VINCULOS (ID_Ocupacion, ID_Vinculo)
      OUTPUT INSERTED.ID_OcupacionVinculo
      VALUES (@ID_Ocupacion, @ID_Vinculo)
    `);

  return result.recordset[0].ID_OcupacionVinculo;
}

async function obtenerTodos() {
  const pool = await poolPromise;
  const result = await pool.request()
    .query('SELECT * FROM OCUPACIONES_VINCULOS');
  return result.recordset;
}

async function obtenerPorId(id) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query('SELECT * FROM OCUPACIONES_VINCULOS WHERE ID_OcupacionVinculo = @id');
  return result.recordset[0];
}

async function actualizarOcupacionVinculo(id, datos) {
  const pool = await poolPromise;
  await pool.request()
    .input('id', sql.Int, id)
    .input('ID_Ocupacion', sql.Int, datos.ID_Ocupacion)
    .input('ID_Vinculo', sql.Int, datos.ID_Vinculo)
    .query(`
      UPDATE OCUPACIONES_VINCULOS
      SET ID_Ocupacion = @ID_Ocupacion,
          ID_Vinculo = @ID_Vinculo
      WHERE ID_OcupacionVinculo = @id
    `);
}

async function eliminarOcupacionVinculo(id) {
  const pool = await poolPromise;
  await pool.request()
    .input('id', sql.Int, id)
    .query('DELETE FROM OCUPACIONES_VINCULOS WHERE ID_OcupacionVinculo = @id');
}

module.exports = {
  crearOcupacionVinculo,
  obtenerTodos,
  obtenerPorId,
  actualizarOcupacionVinculo,
  eliminarOcupacionVinculo
};

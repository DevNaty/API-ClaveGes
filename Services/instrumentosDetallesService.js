const sql = require('mssql');
const { poolPromise } = require('../db');

async function crearInstrumentoDet(datos) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('ID_Instrumento', sql.Int, datos.ID_Instrumento)
    .query(`
      INSERT INTO INSTRUMENTOS_DETALLES (ID_Instrumento)
      OUTPUT INSERTED.ID_DetalleInstrumento
      VALUES (@ID_Instrumento)
    `);

  return result.recordset[0].ID_DetalleInstrumento;
}

async function obtenerInstrumentoDetTodos() {
  const pool = await poolPromise;
  const result = await pool.request()
    .query('SELECT * FROM INSTRUMENTOS_DETALLES');
  return result.recordset;
}

async function obtenerInstrumentoDetPorId(id) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query('SELECT * FROM INSTRUMENTOS_DETALLES WHERE ID_DetalleInstrumento = @id');
  return result.recordset[0];
}

async function actualizarInstrumentoDet(id, datos) {
  const pool = await poolPromise;
  await pool.request()
    .input('id', sql.Int, id)
    .input('ID_Instrumento', sql.Int, datos.ID_Instrumento)
    .query(`
      UPDATE INSTRUMENTOS_DETALLES
      SET ID_Instrumento = @ID_Instrumento,
      WHERE ID_DetalleInstrumento = @id
    `);
}

async function eliminarInstrumentoDet(id) {
  const pool = await poolPromise;
  await pool.request()
    .input('id', sql.Int, id)
    .query('DELETE FROM INSTRUMENTOS_DETALLES WHERE ID_DetalleInstrumento = @id');
}

module.exports = {
  crearInstrumentoDet,
  obtenerInstrumentoDetPorId,
  obtenerInstrumentoDetTodos,
  actualizarInstrumentoDet,
  eliminarInstrumentoDet
};

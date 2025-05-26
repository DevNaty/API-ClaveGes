const sql = require('mssql');
const { poolPromise } = require('../db');

async function crearMatriculaDet(datos) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('ID_Instrumento', sql.Int, datos.ID_Instrumento)
    .query(`
      INSERT INTO MATRICULAS_DETALLES (ID_Instrumento)
      OUTPUT INSERTED.ID_DetalleMatricula
      VALUES (@ID_Instrumento)
    `);

  return result.recordset[0].ID_DetalleMatricula;
}

async function obtenerMatriculaDetTodos() {
  const pool = await poolPromise;
  const result = await pool.request()
    .query('SELECT * FROM MATRICULAS_DETALLES');
  return result.recordset;
}

async function obtenerMatriculaDetPorId(id) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query('SELECT * FROM MATRICULAS_DETALLES WHERE ID_DetalleMatricula = @id');
  return result.recordset[0];
}

async function actualizarMatriculaDet(id, datos) {
  const pool = await poolPromise;
  await pool.request()
    .input('id', sql.Int, id)
    .input('ID_Instrumento', sql.Int, datos.ID_Instrumento)
    .query(`
      UPDATE MATRICULAS_DETALLES
      SET ID_Instrumento = @ID_Instrumento,
      WHERE ID_DetalleMatricula = @id
    `);
}

async function eliminarMatriculaDet(id) {
  const pool = await poolPromise;
  await pool.request()
    .input('id', sql.Int, id)
    .query('DELETE FROM MATRICULAS_DETALLES WHERE ID_DetalleMatricula = @id');
}

module.exports = {
  crearMatriculaDet,
  obtenerMatriculaDetTodos,
  obtenerMatriculaDetPorId,
  actualizarMatriculaDet,
  eliminarMatriculaDet
};

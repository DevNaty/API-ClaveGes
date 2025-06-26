const sql = require('mssql');
const { poolPromise } = require('../db');

async function crearInstrumentoDet(datos) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('ID_Usuario', sql.Int, datos.ID_Usuario)
    .input('ID_Instrumento', sql.Int, datos.ID_Instrumento)
    
    .query(`
      INSERT INTO INSTRUMENTOS_DETALLES (ID_Usuario, ID_Instrumento)
      OUTPUT INSERTED.ID_DetalleInstrumento
      VALUES (@ID_Usuario, @ID_Instrumento)
    `);

  return result.recordset[0].ID_DetalleInstrumento;
}

async function obtenerInstrumentoDetTodos() {
  const pool = await poolPromise;
  const result = await pool.request()
    .query(`SELECT 
      ID_DetalleInstrumento,
      i.Descripcion AS DescripcionInstrumento,
      u.Nombre + ' ' + u.Apellido AS Usuario,
       FROM INSTRUMENTOS_DETALLES id
       LEFT JOIN USUARIOS u ON id.ID_Usuario = u.ID_Usuario
       LEFT JOIN INSTRUMENTOS i ON id.ID_Instrumento = i.ID_Instrumento
       `);
  return result.recordset;
}

async function obtenerInstrumentoDetPorId(id) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query(`SELECT 
      ID_DetalleInstrumento,
      i.Descripcion AS DescripcionInstrumento,
      u.Nombre + ' ' + u.Apellido AS Usuario,
       FROM INSTRUMENTOS_DETALLES id
       LEFT JOIN USUARIOS u ON id.ID_Usuario = u.ID_Usuario
       LEFT JOIN INSTRUMENTOS i ON id.ID_Instrumento = i.ID_Instrumento
        WHERE ID_DetalleInstrumento = @id`);
  return result.recordset[0];
}

async function actualizarInstrumentoDet(id, datos) {
  const pool = await poolPromise;
  await pool.request()
    .input('id', sql.Int, id)
    .input('ID_Usuario', sql.Int, datos.ID_Usuario)
    .input('ID_Instrumento', sql.Int, datos.ID_Instrumento)
    
    .query(`
      UPDATE INSTRUMENTOS_DETALLES
      SET 
      ID_Usuario = @ID_Usuario,
      ID_Instrumento = @ID_Instrumento
      
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

const sql = require('mssql');
const { poolPromise } = require('../db');

async function crearMatriculaDet(datos) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('ID_DatoInscripcion', sql.Int, datos.ID_DatoInscripcion)
    .input('ID_Instrumento', sql.Int, datos.ID_Instrumento)
    .input('FechaMatricula', sql.DateTime, datos.FechaMatricula)
    .input('ID_Estado', sql.Int, datos.ID_Estado)
    
    .query(`
      INSERT INTO MATRICULAS_DETALLES (ID_DatoInscripcion, ID_Instrumento, FechaMatricula, ID_Estado)
      OUTPUT INSERTED.ID_DetalleMatricula
      VALUES (@ID_DatoInscripcion, @ID_Instrumento, @FechaMatricula, @ID_Estado)
    `);

  return result.recordset[0].ID_DetalleMatricula;
}

async function obtenerMatriculaDetTodos() {
  const pool = await poolPromise;
  const result = await pool.request()
    .query(`SELECT 
        md.ID_DetalleMatricula,
        i.Descripcion AS DescripcionInstrumento,
        di.ID_DatoInscripcion,
        di.FechaInscripcion,
        e.Descripcion AS DescripcionEstado

       FROM MATRICULAS_DETALLES md
       LEFT JOIN DATOS_INSCRIPCION di ON md.ID_DatoInscripcion = di.ID_DatoInscripcion
       LEFT JOIN INSTRUMENTOS i ON md.ID_Instrumento = i.ID_Instrumento
       LEFT JOIN ESTADOS e ON md.ID_Estado = e.ID_Estado
       `);
  return result.recordset;
}

async function obtenerMatriculaDetPorId(id) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query(`SELECT 
        md.ID_DetalleMatricula,
        i.Descripcion AS DescripcionInstrumento,
        di.ID_DatoInscripcion,
        di.FechaInscripcion,
        e.Descripcion AS DescripcionEstado

       FROM MATRICULAS_DETALLES md
       LEFT JOIN DATOS_INSCRIPCION di ON md.ID_DatoInscripcion = di.ID_DatoInscripcion
       LEFT JOIN INSTRUMENTOS i ON md.ID_Instrumento = i.ID_Instrumento
       LEFT JOIN ESTADOS e ON md.ID_Estado = e.ID_Estado
        WHERE md.ID_DetalleMatricula = @id
       `);
  return result.recordset[0];
}

async function actualizarMatriculaDet(id, datos) {
  const pool = await poolPromise;
  await pool.request()
    .input('id', sql.Int, id)
    .input('ID_DatoInscripcion', sql.Int, datos.ID_DatoInscripcion)
    .input('ID_Instrumento', sql.Int, datos.ID_Instrumento)
    .input('FechaMatricula', sql.DateTime, datos.FechaMatricula)
    .input('ID_Estado', sql.Int, datos.ID_Estado)

    
    .query(`
      UPDATE MATRICULAS_DETALLES
      SET 
      ID_DatoInscripcion = @ID_DatoInscripcion,
      ID_Instrumento = @ID_Instrumento,
      FechaMatricula = @FechaMatricula,
      ID_Estado = @ID_Estado
      
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

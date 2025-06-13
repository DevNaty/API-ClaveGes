const { poolPromise } = require('../db');
const sql = require('mssql');

const crearInscripcion = async (datos) => {
  const {
    ID_Usuario,
    ID_DetalleMatricula,
    ID_DetalleInstrumento,
    TieneInstrumentos,
    Observaciones,    
    ID_Ciclo,
    ID_Formacion,
    ID_Nivel,
    ID_EspacioCurricular,
    AñoLectivo,
    FechaInscripcion
  } = datos;

  const pool = await poolPromise;
  const result = await pool.request()
    .input('ID_Usuario', sql.Int, ID_Usuario)
    .input('ID_DetalleMatricula', sql.Int, ID_DetalleMatricula)
    .input('ID_DetalleInstrumento', sql.Int, ID_DetalleInstrumento || null)
    .input('TieneInstrumentos', sql.Bit, TieneInstrumentos)
    .input('Observaciones', sql.VarChar, Observaciones)
    .input('ID_Ciclo', sql.Int, ID_Ciclo)
    .input('ID_Formacion', sql.Int, ID_Formacion)
    .input('ID_Nivel', sql.Int, ID_Nivel)
    .input('ID_EspacioCurricular', sql.Int, ID_EspacioCurricular)
    .input('AñoLectivo', sql.Date, AñoLectivo)
    .input('FechaInscripcion', sql.DateTime, FechaInscripcion)
    .query(`
      INSERT INTO DATOS_INSCRIPCION 
      (ID_Usuario, ID_DetalleMatricula, ID_DetalleInstrumento,
      TieneInstrumentos, Observaciones, ID_Ciclo, ID_Formacion, 
      ID_Nivel, ID_EspacioCurricular, AñoLectivo, FechaInscripcion)
      OUTPUT INSERTED.ID_Inscripcion
      VALUES (@ID_Usuario, @ID_DetalleMatricula, @ID_DetalleInstrumento,
      @TieneInstrumentos, @Observaciones, @ID_Ciclo, @ID_Formacion, @ID_Nivel, @ID_EspacioCurricular, @AñoLectivo, @FechaInscripcion)
    `);

  return result.recordset[0];
};

const obtenerInscripciones = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT *    FROM DATOS_INSCRIPCION 
  `);
  return result.recordset;
};

const obtenerInscripcionPorId = async (id) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('ID_DatoInscripcion', sql.Int, id)
    .query(`
      SELECT * FROM DATOS_INSCRIPCION WHERE ID_DatoInscripcion = @ID_DatoInscripcion
    `);
  return result.recordset[0];
};

const eliminarInscripcion = async (id) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('ID_DatoInscripcion', sql.Int, id)
    .query(`DELETE FROM DATOS_INSCRIPCION WHERE ID_DatoInscripcion = @ID_DatoInscripcion`);
  return result.rowsAffected[0] > 0;
};

module.exports = {
  crearInscripcion,
  obtenerInscripciones,
  obtenerInscripcionPorId,
  eliminarInscripcion
};

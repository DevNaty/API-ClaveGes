const { poolPromise } = require('../db');
const sql = require('mssql');

const crearInscripcion = async (datos) => {
  const {
    ID_Usuario,
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
    .input('TieneInstrumentos', sql.Bit, TieneInstrumentos)
    .input('Observaciones', sql.VarChar, Observaciones)
    .input('ID_Ciclo', sql.Int, ID_Ciclo)
    .input('ID_Formacion', sql.Int, ID_Formacion)
    .input('ID_Nivel', sql.Int, ID_Nivel)
    .input('ID_EspacioCurricular', sql.Int, ID_EspacioCurricular)
    .input('AñoLectivo', sql.Int, AñoLectivo)
    .input('FechaInscripcion', sql.DateTime, FechaInscripcion)
    .query(`
      INSERT INTO DATOS_INSCRIPCION 
      (ID_Usuario, 
      TieneInstrumentos, Observaciones, ID_Ciclo, ID_Formacion, 
      ID_Nivel, ID_EspacioCurricular, AñoLectivo, FechaInscripcion)
      OUTPUT INSERTED.ID_DatoInscripcion
      VALUES (@ID_Usuario, 
      @TieneInstrumentos, @Observaciones, @ID_Ciclo, @ID_Formacion, @ID_Nivel, @ID_EspacioCurricular, @AñoLectivo, @FechaInscripcion)
    `);

  return result.recordset[0];
};
const obtenerInscripciones = async (id) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('ID_DatoInscripcion', sql.Int, id)
    .query(`
      SELECT 
      u.Nombre + ' ' + u.Apellido AS Usuario,
      TieneInstrumentos, 
      Observaciones, 
      c.Descripcion AS DescripcionCiclo, 
      f.Descripcion AS DescripcionFormacion,
      n. Descripcion AS DescripcionNivel, 
      ec. Descripcion AS DescripcionEspacioCurricular, 
      AñoLectivo, 
      FechaInscripcion

      FROM DATOS_INSCRIPCION di
      LEFT JOIN USUARIOS u ON di.ID_Usuario = u.ID_Usuario
      LEFT JOIN CICLOS c ON di.ID_Ciclo = c.ID_Ciclo
      LEFT JOIN FORMACIONES f ON di.ID_Formacion = f.ID_Formacion 
      LEFT JOIN NIVELES n ON di.ID_Nivel = n.ID_Nivel
      LEFT JOIN ESPACIOSCURRICULARES ec ON di.ID_EspacioCurricular = ec.ID_EspacioCurricular
      
    `);
  return result.recordset[0];
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

async function actualizarInscripcion(id, datos) {
  const pool = await poolPromise;
  const request = pool.request();

  // A modo de ejemplo solo actualiza algunos campos:
  await request
    .input('id', sql.Int, id)
    
    .input('TieneInstrumentos', sql.Bit, datos.TieneInstrumentos)
    .input('Observaciones', sql.VarChar, datos.Observaciones)
    .input('ID_Ciclo', sql.Int, datos.ID_Ciclo)
    .input('ID_Formacion', sql.Int, datos.ID_Formacion)
    .input('ID_Nivel', sql.Int, datos.ID_Nivel)
    .input('ID_EspacioCurricular', sql.Int, datos.ID_EspacioCurricular)
    .input('AñoLectivo', sql.Date, datos.AñoLectivo)
    .input('FechaInscripcion', sql.DateTime, datos.FechaInscripcion)
    
    .query(`
      UPDATE DATOS_INSCRIPCION
      SET 
          
          TieneInstrumentos = @TieneInstrumentos, 
          Observaciones = @Observaciones,
          ID_Ciclo = @ID_Ciclo,
          ID_Formacion = @ID_Formacion,
          ID_Nivel = @ID_Nivel, 
          ID_EspacioCurricular = @ID_EspacioCurricular,
          AñoLectivo = @AñoLectivo, 
          FechaInscripcion = @FechaInscripcion
        
      WHERE ID_DatoInscripcion = @id
    `);
}


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
  actualizarInscripcion,
  eliminarInscripcion
};

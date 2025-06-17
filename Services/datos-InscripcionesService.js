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
      OUTPUT INSERTED.ID_DatoInscripcion
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

async function actualizarInscripcion(id, datos) {
  const pool = await poolPromise;
  const request = pool.request();

  // A modo de ejemplo solo actualiza algunos campos:
  await request
    .input('id', sql.Int, id)
    
    .input('ID_DetalleMatricula', sql.Int, datos.ID_DetalleMatricula)
    .input('ID_DetalleInstrumento', sql.Int, datos.ID_DetalleInstrumento)
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
          
          ID_DetalleMatricula = @ID_DetalleMatricula,
          ID_DetalleInstrumento = @ID_DetalleInstrumento, 
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

const { poolPromise } = require('../db');
const sql = require('mssql');

/**
 * @desc Obtiene todas las inscripciones, mostrando las descripciones
 * de las entidades relacionadas en lugar de solo sus IDs.
 * @returns {Array} Un array de objetos de inscripción con descripciones legibles.
 */
const obtenerInscripcionesConDescripciones = async () => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT
        DI.ID_DatoInscripcion,
        U.Nombre + ' ' + U.Apellido AS NombreUsuario, -- Nombre completo del usuario
        DMat.Descripcion AS DescripcionMatricula,      -- Descripción de detalle de matrícula
        DInst.Descripcion AS DescripcionInstrumento,   -- Descripción de detalle de instrumento
        DI.TieneInstrumentos,
        DI.Observaciones,
        C.Descripcion AS DescripcionCiclo,             -- Descripción del ciclo
        F.Descripcion AS DescripcionFormacion,         -- Descripción de la formación
        N.Descripcion AS DescripcionNivel,             -- Descripción del nivel
        EC.Descripcion AS DescripcionEspacioCurricular, -- Descripción del espacio curricular
        DI.AñoLectivo,
        FORMAT(DI.FechaInscripcion, 'yyyy-MM-dd') AS FechaInscripcion -- Formato de fecha
      FROM
        DATOS_INSCRIPCION DI
      LEFT JOIN
        USUARIOS U ON DI.ID_Usuario = U.ID_Usuario
      LEFT JOIN
        DETALLE_MATRICULA DMat ON DI.ID_DetalleMatricula = DMat.ID_DetalleMatricula -- Asume el nombre de tu tabla de detalle de matrícula
      LEFT JOIN
        DETALLE_INSTRUMENTO DInst ON DI.ID_DetalleInstrumento = DInst.ID_DetalleInstrumento -- Asume el nombre de tu tabla de detalle de instrumento
      LEFT JOIN
        CICLOS C ON DI.ID_Ciclo = C.ID_Ciclo
      LEFT JOIN
        FORMACIONES F ON DI.ID_Formacion = F.ID_Formacion
      LEFT JOIN
        NIVELES N ON DI.ID_Nivel = N.ID_Nivel
      LEFT JOIN
        ESPACIOSCURRICULARES EC ON DI.ID_EspacioCurricular = EC.ID_EspacioCurricular;
    `);
    return result.recordset;
  } catch (error) {
    console.error('❌ Error al obtener inscripciones con descripciones:', error);
    throw new Error('No se pudieron obtener las inscripciones con descripciones.');
  }
};


module.exports = {
  crearInscripcion,
  obtenerInscripciones,
  obtenerInscripcionPorId,
  actualizarInscripcion,
  eliminarInscripcion,
  obtenerInscripcionesConDescripciones
};

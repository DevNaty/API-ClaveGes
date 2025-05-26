const { poolPromise } = require('../db');
const sql = require('mssql');

const crearInscripcion = async (datos) => {
  const {
    ID_Usuario,
    ID_DatosAlumno,
    ID_DetalleMatricula,
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
    .input('ID_DatosAlumno', sql.Int, ID_DatosAlumno || null)
    .input('ID_DetalleMatricula', sql.Int, ID_DetalleMatricula)
    .input('ID_Ciclo', sql.Int, ID_Ciclo)
    .input('ID_Formacion', sql.Int, ID_Formacion)
    .input('ID_Nivel', sql.Int, ID_Nivel)
    .input('ID_EspacioCurricular', sql.Int, ID_EspacioCurricular)
    .input('AñoLectivo', sql.Int, AñoLectivo)
    .input('FechaInscripcion', sql.DateTime, FechaInscripcion)
    .query(`
      INSERT INTO INSCRIPCIONES 
      (ID_Usuario, ID_DatosAlumno, ID_DetalleMatricula, ID_Ciclo, ID_Formacion, ID_Nivel, ID_EspacioCurricular, AñoLectivo, FechaInscripcion)
      OUTPUT INSERTED.ID_Inscripcion
      VALUES (@ID_Usuario, @ID_DatosAlumno, @ID_DetalleMatricula, @ID_Ciclo, @ID_Formacion, @ID_Nivel, @ID_EspacioCurricular, @AñoLectivo, @FechaInscripcion)
    `);

  return result.recordset[0];
};

const obtenerInscripciones = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT i.*, u.Nombre, da.Nombre AS Alumno
    FROM INSCRIPCIONES i
    LEFT JOIN USUARIOS u ON i.ID_Usuario = u.ID_Usuario
    LEFT JOIN DATOS_ALUMNOS da ON i.ID_DatosAlumno = da.ID_DatosAlumno
  `);
  return result.recordset;
};

const obtenerInscripcionPorId = async (id) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('ID_Inscripcion', sql.Int, id)
    .query(`
      SELECT * FROM INSCRIPCIONES WHERE ID_Inscripcion = @ID_Inscripcion
    `);
  return result.recordset[0];
};

const eliminarInscripcion = async (id) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('ID_Inscripcion', sql.Int, id)
    .query(`DELETE FROM INSCRIPCIONES WHERE ID_Inscripcion = @ID_Inscripcion`);
  return result.rowsAffected[0] > 0;
};

module.exports = {
  crearInscripcion,
  obtenerInscripciones,
  obtenerInscripcionPorId,
  eliminarInscripcion
};

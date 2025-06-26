const sql = require('mssql');
const { poolPromise } = require('../db');

async function crearDatosAlumno(datos) {
  const pool = await poolPromise;
  const request = pool.request();

  // Solo como ejemplo: se pueden incluir más campos
  const result = await request
    .input('ID_Usuario', sql.Int, datos.ID_Usuario)
    .input('FechaNacimiento', sql.Date, datos.FechaNacimiento)
    .input('LugarNacimiento', sql.VarChar, datos.LugarNacimiento)
    .input('ID_Localidad', sql.Int, datos.ID_Localidad)
    .input('ID_Calle', sql.Int, datos.ID_Calle)
    .input('Numero', sql.VarChar, datos.Numero)
    .input('ID_Nacionalidad', sql.Int, datos.ID_Nacionalidad)
    .input('Telefono', sql.VarChar, datos.Telefono)
    .input('Email', sql.VarChar, datos.Email)
    .input('ID_DatosMadre', sql.Int, datos.ID_DatosMadre)
    .input('ID_DatosPadre', sql.Int, datos.ID_DatosPadre)
    .input('ID_DatosTutor', sql.Int, datos.ID_DatosTutor)
    .input('ID_DatosEscolaridad', sql.Int, datos.ID_DatosEscolaridad)
    .input('ID_Ocupacion', sql.Int, datos.ID_Ocupacion)
    .input('ID_GradoEstudioObtenido', sql.Int, datos.ID_GradoEstudioObtenido)
    .query(`
      INSERT INTO DATOS_ALUMNOS (
        ID_Usuario, FechaNacimiento, LugarNacimiento, 
        ID_Localidad, ID_Calle, Numero, 
        ID_Nacionalidad, 
        Telefono, Email, 
        ID_DatosMadre, 
        ID_DatosPadre, 
        ID_DatosTutor, 
        ID_DatosEscolaridad,
        ID_Ocupacion, 
        ID_GradoEstudioObtenido
        
      )
      OUTPUT INSERTED.ID_DatosAlumno
      VALUES (
        @ID_Usuario, @FechaNacimiento, @LugarNacimiento, 
        @ID_Localidad, @ID_Calle, @Numero, 
        @ID_Nacionalidad, 
        @Telefono, @Email, 
        @ID_DatosMadre, 
        @ID_DatosPadre, 
        @ID_DatosTutor, 
        @ID_DatosEscolaridad,
        @ID_Ocupacion,
        @ID_GradoEstudioObtenido
      )
    `);

  return { id: result.recordset[0].ID_DatosAlumno };
}
async function obtenerDatosAlumno() {
  const pool = await poolPromise;
  const result = await pool.request()

    .query(`
      SELECT
  da.ID_DatosAlumno,
  u.Nombre + ' ' + u.Apellido AS Usuario,
  da.FechaNacimiento,
  da.LugarNacimiento,
  l.Descripcion AS Localidad,
  c.Descripcion AS Calle,
  da.Numero,
  n.Descripcion AS Nacionalidad,
  da.Telefono,
  da.Email,
  -- Datos de la Madre
  dm.ID_DatosMadre,
  dm.Nombre AS Madre,
  dm.Apellido AS ApellidoMadre,
  dm.Telefono AS TelefonoMadre,
  dm.Email AS EmailMadre,
  om.Descripcion AS OcupacionMadre, -- Ocupación de la Madre
  -- Datos del Padre
  dp.ID_DatosPadre,
  dp.Nombre AS Padre,
  dp.Apellido AS ApellidoPadre,
  dp.Telefono AS TelefonoPadre,
  dp.Email AS EmailPadre,
  op.Descripcion AS OcupacionPadre, -- Ocupación del Padre
  -- Datos del Tutor
  dt.ID_DatosTutor,
  dt.Nombre AS Tutor,
  dt.Apellido AS ApellidoTutor,
  dt.Telefono AS TelefonoTutor,
  dt.Email AS EmailTutor,
  ot.Descripcion AS OcupacionTutor, -- Ocupación del Tutor
  -- Datos del Alumno (si el alumno también tiene ocupación)
  oa.Descripcion AS OcupacionAlumno, -- Ocupación del Alumno
  ge.Descripcion AS GradoEstudioObtenido
FROM
  DATOS_ALUMNOS da
LEFT JOIN
  USUARIOS u ON da.ID_Usuario = u.ID_Usuario
LEFT JOIN
  LOCALIDADES l ON da.ID_Localidad = l.ID_Localidad -- Asumo que hay una tabla LOCALIDADES
LEFT JOIN
  CALLES c ON da.ID_Calle = c.ID_Calle -- Asumo que hay una tabla CALLES
LEFT JOIN
  NACIONALIDADES n ON da.ID_Nacionalidad = n.ID_Nacionalidad -- Asumo que hay una tabla NACIONALIDADES
LEFT JOIN
  GRADO_DE_ESTUDIOS ge ON da.ID_GradoEstudioObtenido = ge.ID_GradoEstudioObtenido -- Asumo una tabla GRADO_DE_ESTUDIOS
LEFT JOIN
  DATOS_MADRE dm ON da.ID_DatosMadre = dm.ID_DatosMadre
LEFT JOIN
  DATOS_PADRE dp ON da.ID_DatosPadre = dp.ID_DatosPadre
LEFT JOIN
  DATOS_TUTOR dt ON da.ID_DatosTutor = dt.ID_DatosTutor
LEFT JOIN
  OCUPACIONES om ON dm.ID_Ocupacion = om.ID_Ocupacion -- Ocupación para la Madre
LEFT JOIN
  OCUPACIONES op ON dp.ID_Ocupacion = op.ID_Ocupacion -- Ocupación para el Padre
LEFT JOIN
  OCUPACIONES ot ON dt.ID_Ocupacion = ot.ID_Ocupacion -- Ocupación para el Tutor
LEFT JOIN
  OCUPACIONES oa ON da.ID_Ocupacion = oa.ID_Ocupacion; -- Ocupación para el Alumno (si aplica)`);
  return result.recordset;
}

async function obtenerDatosAlumnoPorId(id) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query(
      `SELECT
  da.ID_DatosAlumno,
  u.Nombre + ' ' + u.Apellido AS Usuario,
  da.FechaNacimiento,
  da.LugarNacimiento,
  l.Descripcion AS Localidad,
  c.Descripcion AS Calle,
  da.Numero,
  n.Descripcion AS Nacionalidad,
  da.Telefono,
  da.Email,
  -- Datos de la Madre
  
  dm.Nombre AS Madre,
  dm.Apellido AS ApellidoMadre,
  dm.Telefono AS TelefonoMadre,
  dm.Email AS EmailMadre,
  om.Descripcion AS OcupacionMadre, -- Ocupación de la Madre
  -- Datos del Padre
  
  dp.Nombre AS Padre,
  dp.Apellido AS ApellidoPadre,
  dp.Telefono AS TelefonoPadre,
  dp.Email AS EmailPadre,
  op.Descripcion AS OcupacionPadre, -- Ocupación del Padre
  -- Datos del Tutor

  dt.Nombre AS Tutor,
  dt.Apellido AS ApellidoTutor,
  dt.Telefono AS TelefonoTutor,
  dt.Email AS EmailTutor,
  ot.Descripcion AS OcupacionTutor, -- Ocupación del Tutor
  -- Datos del Alumno (si el alumno también tiene ocupación)
  oa.Descripcion AS OcupacionAlumno, -- Ocupación del Alumno
  ge.Descripcion AS GradoEstudioObtenido
FROM
  DATOS_ALUMNOS da
LEFT JOIN USUARIOS u ON da.ID_Usuario = u.ID_Usuario
LEFT JOIN LOCALIDADES l ON da.ID_Localidad = l.ID_Localidad -- Asumo que hay una tabla LOCALIDADES
LEFT JOIN CALLES c ON da.ID_Calle = c.ID_Calle -- Asumo que hay una tabla CALLES
LEFT JOIN NACIONALIDADES n ON da.ID_Nacionalidad = n.ID_Nacionalidad -- Asumo que hay una tabla NACIONALIDADES
LEFT JOIN GRADO_DE_ESTUDIOS ge ON da.ID_GradoEstudioObtenido = ge.ID_GradoEstudioObtenido -- Asumo una tabla GRADO_DE_ESTUDIOS
LEFT JOIN DATOS_MADRE dm ON da.ID_DatosMadre = dm.ID_DatosMadre
LEFT JOIN DATOS_PADRE dp ON da.ID_DatosPadre = dp.ID_DatosPadre
LEFT JOIN DATOS_TUTOR dt ON da.ID_DatosTutor = dt.ID_DatosTutor
LEFT JOIN OCUPACIONES om ON dm.ID_Ocupacion = om.ID_Ocupacion
LEFT JOIN OCUPACIONES op ON dp.ID_Ocupacion = op.ID_Ocupacion 
LEFT JOIN OCUPACIONES ot ON dt.ID_Ocupacion = ot.ID_Ocupacion
LEFT JOIN OCUPACIONES oa ON da.ID_Ocupacion = oa.ID_Ocupacion 
 WHERE ID_DatosAlumno = @id`);

  return result.recordset[0];
}

async function actualizarDatosAlumno(id, datos) {
  const pool = await poolPromise;
  const request = pool.request();

  // A modo de ejemplo solo actualiza algunos campos:
  await request
    .input('id', sql.Int, id)
    .input('FechaNacimiento', sql.Date, datos.FechaNacimiento)
    .input('LugarNacimiento', sql.VarChar, datos.LugarNacimiento)
    .input('ID_Localidad', sql.Int, datos.ID_Localidad)
    .input('ID_Calle', sql.Int, datos.ID_Calle)
    .input('Numero', sql.VarChar, datos.Numero)
    .input('ID_Nacionalidad', sql.Int, datos.ID_Nacionalidad)
    .input('Telefono', sql.VarChar, datos.Telefono)
    .input('Email', sql.VarChar, datos.Email)
    .input('ID_DatosMadre', sql.Int, datos.ID_DatosMadre)
    .input('ID_DatosPadre', sql.Int, datos.ID_DatosPadre)
    .input('ID_DatosTutor', sql.Int, datos.ID_DatosTutor)
    .input('ID_DatosEscolaridad', sql.Int, datos.ID_DatosEscolaridad)
    .input('ID_Ocupacion', sql.Int, datos.ID_Ocupacion)
    .input('ID_GradoEstudioObtenido', sql.Int, datos.ID_GradoEstudioObtenido)
    .query(`
      UPDATE DATOS_ALUMNOS
      SET 
          FechaNacimiento = @FechaNacimiento, 
          LugarNacimiento = @LugarNacimiento,
          ID_Localidad = @ID_Localidad, 
          ID_Calle = @ID_Calle, 
          Numero = @Numero,
          ID_Nacionalidad = @ID_Nacionalidad,
          Telefono = @Telefono,
          Email = @Email, 
          ID_DatosMadre = @ID_DatosMadre,
          ID_DatosPadre = @ID_DatosPadre, 
          ID_DatosTutor = @ID_DatosTutor, 
          ID_DatosEscolaridad = @ID_DatosEscolaridad,
          ID_Ocupacion = @ID_Ocupacion,
          ID_GradoEstudioObtenido = @ID_GradoEstudioObtenido
        
      WHERE ID_DatosAlumno = @id
    `);
}

async function eliminarDatosAlumno(id) {
  const pool = await poolPromise;
  await pool.request()
    .input('id', sql.Int, id)
    .query('DELETE FROM DATOS_ALUMNOS WHERE ID_DatosAlumno = @id');
}

module.exports = {
  crearDatosAlumno,
  obtenerDatosAlumno,
  obtenerDatosAlumnoPorId,
  actualizarDatosAlumno,
  eliminarDatosAlumno
};

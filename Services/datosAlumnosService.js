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
    .input('ID_DatosEscolarridad', sql.Int, datos.ID_DatosEscolarridad)
    .query(`
      INSERT INTO DATOS_ALUMNOS (
        ID_Usuario, FechaNacimiento, LugarNacimiento, 
        ID_Localidad, ID_Calle, Numero, 
        ID_Nacionalidad, Telefono, Email, 
        ID_DatosMadre, ID_DatosPadre, ID_DatosTutor, ID_DatosEscolarridad
        
      )
      OUTPUT INSERTED.ID_DatosAlumno
      VALUES (
        @ID_Usuario, @FechaNacimiento, @LugarNacimiento, @ID_Localidad, @ID_Calle, @Numero, 
        @ID_Nacionalidad, @Telefono, @Email, 
        @ID_DatosMadre, @ID_DatosPadre, @ID_DatosTutor, @ID_DatosEscolarridad
      )
    `);

  return { id: result.recordset[0].ID_DatosAlumno };
}
async function obtenerDatosAlumno() {
  const pool = await poolPromise;
  const result = await pool.request()
    .query('SELECT * FROM DATOS_ALUMNOS');
  return result.recordset;
}

async function obtenerDatosAlumnoPorId(id) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query('SELECT * FROM DATOS_ALUMNOS WHERE ID_DatosAlumno = @id');

  return result.recordset[0];
}

async function actualizarDatosAlumno(id, datos) {
  const pool = await poolPromise;
  const request = pool.request();

  // A modo de ejemplo solo actualiza algunos campos:
  await request
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
    .input('ID_DatosEscolarridad', sql.Int, datos.ID_DatosEscolarridad)
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
          ID_DatosEscolarridad = @ID_DatosEscolarridad
        
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

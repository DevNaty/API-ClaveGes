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
    .input('Nombre_Mama', sql.VarChar, datos.Nombre_Mama)
    .input('Apellido_Mama', sql.VarChar, datos.Apellido_Mama)
    .input('Dni_Mama', sql.VarChar, datos.Dni_Mama)
    .input('Nombre_Papa', sql.VarChar, datos.Nombre_Papa)
    .input('Apellido_Papa', sql.VarChar, datos.Apellido_Papa)
    .input('Dni_Papa', sql.VarChar, datos.Dni_Papa)
    .input('ID_OcupacionVinculo', sql.Int, datos.ID_OcupacionVinculo)
    .input('Nombre_Tutor', sql.VarChar, datos.Nombre_Tutor)
    .input('Apellido_Tutor', sql.VarChar, datos.Apellido_Tutor)
    .input('Telefono1', sql.VarChar, datos.Telefono1)
    .input('Telefono2', sql.VarChar, datos.Telefono2)
    .input('Tel1_Pertenece', sql.VarChar, datos.Tel1_Pertenece)
    .input('Tel2_Pertenece', sql.VarChar, datos.Tel2_Pertenece)
    .input('EmailCominicacion', sql.VarChar, datos.EmailCominicacion)
    .input('ID_Escuela', sql.Int, datos.ID_Escuela)
    .input('ID_NivelEscolar', sql.Int, datos.ID_NivelEscolar)
    .input('ID_Grado', sql.Int, datos.ID_Grado)
    .input('ID_Turno', sql.Int, datos.ID_Turno)
    .input('ID_DetalleMatricula', sql.Int, datos.ID_DetalleMatricula)
    .input('ID_DetalleInstrumento', sql.Int, datos.ID_DetalleInstrumento)
    .input('TieneInstrumento', sql.Bit, datos.TieneInstrumento)
    .input('ID_GradoEstudioObtenido', sql.Int, datos.ID_GradoEstudioObtenido)
    .input('ID_Ocupacion', sql.Int, datos.ID_Ocupacion)
    .input('Observaciones', sql.VarChar, datos.Observaciones)
    .query(`
      INSERT INTO DATOS_ALUMNOS (
        ID_Usuario, FechaNacimiento, LugarNacimiento, ID_Localidad, ID_Calle, Numero, 
        ID_Nacionalidad, Nombre_Mama, Apellido_Mama, Dni_Mama, Nombre_Papa, Apellido_Papa, Dni_Papa,
        ID_OcupacionVinculo, Nombre_Tutor, Apellido_Tutor, Telefono1, Telefono2,
        Tel1_Pertenece, Tel2_Pertenece, EmailCominicacion, ID_Escuela, ID_NivelEscolar, 
        ID_Grado, ID_Turno, ID_DetalleMatricula, ID_DetalleInstrumento, TieneInstrumento, 
        ID_GradoEstudioObtenido, ID_Ocupacion, Observaciones
      )
      OUTPUT INSERTED.ID_DatosAlumno
      VALUES (
        @ID_Usuario, @FechaNacimiento, @LugarNacimiento, @ID_Localidad, @ID_Calle, @Numero, 
        @ID_Nacionalidad, @Nombre_Mama, @Apellido_Mama, @Dni_Mama, @Nombre_Papa, @Apellido_Papa, @Dni_Papa,
        @ID_OcupacionVinculo, @Nombre_Tutor, @Apellido_Tutor, @Telefono1, @Telefono2,
        @Tel1_Pertenece, @Tel2_Pertenece, @EmailCominicacion, @ID_Escuela, @ID_NivelEscolar, 
        @ID_Grado, @ID_Turno, @ID_DetalleMatricula, @ID_DetalleInstrumento, @TieneInstrumento, 
        @ID_GradoEstudioObtenido, @ID_Ocupacion, @Observaciones
      )
    `);

  return { id: result.recordset[0].ID_DatosAlumno };
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
    .input('ID_Localidad', sql.Int, datos.ID_Localidad)
    .input('ID_Calle', sql.Int, datos.ID_Calle)
    .input('Numero', sql.VarChar, datos.Numero)
    .input('ID_OcupacionVinculo', sql.Int, datos.ID_OcupacionVinculo)
    .input('Nombre_Tutor', sql.VarChar, datos.Nombre_Tutor)
    .input('Apellido_Tutor', sql.VarChar, datos.Apellido_Tutor)
    .input('Telefono1', sql.VarChar, datos.Telefono1)
    .input('Telefono2', sql.VarChar, datos.Telefono2)
    .input('Tel1_Pertenece', sql.VarChar, datos.Tel1_Pertenece)
    .input('Tel2_Pertenece', sql.VarChar, datos.Tel2_Pertenece)
    .input('EmailCominicacion', sql.VarChar, datos.EmailCominicacion)
    .input('ID_Escuela', sql.Int, datos.ID_Escuela)
    .input('ID_NivelEscolar', sql.Int, datos.ID_NivelEscolar)
    .input('ID_Grado', sql.Int, datos.ID_Grado)
    .input('ID_Turno', sql.Int, datos.ID_Turno)
    .input('ID_DetalleMatricula', sql.Int, datos.ID_DetalleMatricula)
    .input('ID_DetalleInstrumento', sql.Int, datos.ID_DetalleInstrumento)
    .input('TieneInstrumento', sql.Bit, datos.TieneInstrumento)
    .input('ID_GradoEstudioObtenido', sql.Int, datos.ID_GradoEstudioObtenido)
    .input('ID_Ocupacion', sql.Int, datos.ID_Ocupacion)
    .input('Observaciones', sql.VarChar, datos.Observaciones)
    .query(`
      UPDATE DATOS_ALUMNOS
      SET 
          ID_Localidad = @ID_Localidad,
          ID_Calle = @ID_Calle,
          Numero = @Numero,
          ID_OcupacionVinculo = @ID_OcupacionVinculo,
          Nombre_Tutor = @Nombre_Tutor,
          Apellido_Tutor = @Apellido_Tutor,
          Telefono1 = @Telefono1,
          Telefono2 = @Telefono2,
          Tel1_Pertenece = @Tel1_Pertenece,
          Tel2_Pertenece = @Tel2_Pertenece,
          EmailCominicacion = @EmailCominicacion,
          ID_Escuela = @ID_Escuela,
          ID_NivelEscolar = @ID_NivelEscolar,
          ID_Grado = @ID_Grado,
          ID_Turno = @ID_Turno,
          ID_DetalleMatricula = @ID_DetalleMatricula,
          ID_DetalleInstrumento = @ID_DetalleInstrumento,
          TieneInstrumento = @TieneInstrumento,
          ID_GradoEstudioObtenido = @ID_GradoEstudioObtenido,
          ID_Ocupacion = @ID_Ocupacion,
          Observaciones = @Observaciones


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
  obtenerDatosAlumnoPorId,
  actualizarDatosAlumno,
  eliminarDatosAlumno
};

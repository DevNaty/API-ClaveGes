const sql = require('mssql');
const { poolPromise } = require('../db');

async function crearDatosTutor(datos) {
  const pool = await poolPromise;
  const request = pool.request();

  // Solo como ejemplo: se pueden incluir más campos
  const result = await request
    .input('ID_Usuario', sql.Int, datos.ID_Usuario)
    .input('Nombre', sql.VarChar, datos.Nombre)
    .input('Apellido', sql.VarChar, datos.Apellido)
    .input('Dni', sql.VarChar, datos.Dni)
    .input('Telefono', sql.VarChar, datos.Telefono)
    .input('Email', sql.VarChar, datos.Email)
    .input('ID_Ocupacion', sql.Int, datos.ID_Ocupacion)
    
    .query(`
      INSERT INTO DATOS_TUTOR (
        ID_Usuario, Nombre, Apellido, Dni, 
        Telefono, Email,ID_Ocupacion 
      )
      OUTPUT INSERTED.ID_DatosTutor
      VALUES (
        @ID_Usuario, 
        @Nombre,
        @Apellido,
        @Dni, 
        @Telefono,
        @Email,
        @ID_Ocupacion
      )
    `);

  return { id: result.recordset[0].ID_DatosTutor };
}

async function obtenerDatosTutor() {
  const pool = await poolPromise;
  const result = await pool.request()
    .query('SELECT * FROM DATOS_TUTOR');
  return result.recordset;
}

async function obtenerDatosTutorPorId(id) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query('SELECT * FROM DATOS_TUTOR WHERE ID_DatosTutor = @id');

  return result.recordset[0];
}

async function actualizarDatosTutor(id, datos) {
  const pool = await poolPromise;
  const request = pool.request();

  // A modo de ejemplo solo actualiza algunos campos:
  await request
    
    .input('id', sql.Int, id)
    .input('Nombre', sql.VarChar, datos.Nombre)
    .input('Apellido', sql.VarChar, datos.Apellido)
    .input('Dni', sql.VarChar, datos.Dni)
    .input('Telefono', sql.VarChar, datos.Telefono)
    .input('Email', sql.VarChar, datos.Email)
    .input('ID_Ocupacion', sql.Int, datos.ID_Ocupacion)
    
    .query(`
      UPDATE DATOS_TUTOR
      SET 
          
          Nombre  = @Nombre,
          Apellido  = @Apellido,
          Dni = @Dni,
          Telefono = @Telefono,
          Email = @Email,
          ID_Ocupacion = @ID_Ocupacion
        
      WHERE ID_DatosTutor = @id
    `);
}

async function eliminarDatosTutor(id) {
  const pool = await poolPromise;
  await pool.request()
    .input('id', sql.Int, id)
    .query('DELETE FROM DATOS_TUTOR WHERE ID_DatosTutor = @id');
}

module.exports = {
  crearDatosTutor,
  obtenerDatosTutor,
  obtenerDatosTutorPorId,   
  actualizarDatosTutor,
  eliminarDatosTutor

};

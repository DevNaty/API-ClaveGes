const sql = require('mssql');
const { poolPromise } = require('../db');

async function crearDatosMadre(datos) {
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
      INSERT INTO DATOS_MADRE (
        ID_Usuario, 
        Nombre, 
        Apellido, 
        Dni, 
        Telefono,
        Email, 
        ID_Ocupacion
      )
      OUTPUT INSERTED.ID_DatosMadre
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

  return { id: result.recordset[0].ID_DatosMadre };
}
async function obtenerDatosMadre() {
  const pool = await poolPromise;
  const result = await pool.request()
    .query(`
      SELECT 
      u.ID_Usuario,
      u.Nombre AS NombreUsuario,
      u.Apellido AS ApellidoUsuario,
      dm.id_datosmadre,
      dm.nombre AS NombreMadre,
      dm.apellido AS ApellidoMadre,
      dm.dni AS DniMadre, 
      dm.telefono AS TelefonoMadre,
      dm.email AS EmailMadre,
      o.descripcion AS Ocupacion

      FROM DATOS_MADRE dm
      LEFT JOIN USUARIOS u ON dm.ID_Usuario = u.ID_Usuario
      LEFT JOIN OCUPACIONES o ON dm.ID_Ocupacion = o.ID_Ocupacion
      `);
  return result.recordset;
}

async function obtenerDatosMadrePorId(id) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query(`SELECT 
      u.ID_Usuario,
      u.Nombre AS NombreUsuario,
      u.Apellido AS ApellidoUsuario,
      dm.id_datosmadre,
      dm.nombre AS NombreMadre,
      dm.apellido AS ApellidoMadre,
      dm.dni AS DniMadre, 
      dm.telefono AS TelefonoMadre,
      dm.email AS EmailMadre,
      o.descripcion AS Ocupacion

      FROM DATOS_MADRE dm
      LEFT JOIN USUARIOS u ON dm.ID_Usuario = u.ID_Usuario
      LEFT JOIN OCUPACIONES o ON dm.ID_Ocupacion = o.ID_Ocupacion

      WHERE ID_DatosMadre = @id` );

  return result.recordset[0];
}

async function actualizarDatosMadre(id, datos) {
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
      UPDATE DATOS_MADRE
      SET 
          
          Nombre  = @Nombre,
          Apellido  = @Apellido,
          Dni = @Dni,
          Telefono = @Telefono,
          Email  = @Email,
          ID_Ocupacion = @ID_Ocupacion
        
      WHERE ID_DatosMadre = @id
    `);
}

async function eliminarDatosMadre(id) {
  const pool = await poolPromise;
  await pool.request()
    .input('id', sql.Int, id)
    .query('DELETE FROM DATOS_MADRE WHERE ID_DatosMadre = @id');
}

module.exports = {
  crearDatosMadre,
  obtenerDatosMadre,
  obtenerDatosMadrePorId,   
  actualizarDatosMadre,
  eliminarDatosMadre

};

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
    .query('SELECT * FROM DATOS_MADRE');
  return result.recordset;
}

async function obtenerDatosMadrePorId(id) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query('SELECT * FROM DATOS_MADRE WHERE ID_DatosMadre = @id');

  return result.recordset[0];
}

async function actualizarDatosMadre(id, datos) {
  const pool = await poolPromise;
  const request = pool.request();

  // A modo de ejemplo solo actualiza algunos campos:
  await request
    
    
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

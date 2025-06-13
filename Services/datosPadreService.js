const sql = require('mssql');
const { poolPromise } = require('../db');

async function crearDatosPadre(datos) {
  const pool = await poolPromise;
  const request = pool.request();

  // Solo como ejemplo: se pueden incluir más campos
  const result = await request
    .input('ID_Usuario', sql.Int, datos.ID_Usuario)
    .input('Nombre', sql.VarChar, datos.Nombre)
    .input('Apellido', sql.VarChar, datos.Apellido)
    .input('Dni', sql.VarChar, datos.Dni)
    .input('ID_Ocupacion', sql.Int, datos.ID_Ocupacion)
    .input('Telefono', sql.VarChar, datos.Telefono)
    .input('Email', sql.VarChar, datos.Email)
    
    .query(`
      INSERT INTO DATOS_PADRE (
        ID_Usuario, Nombre, Apellido, Dni, Nombre, Apellido, Dni,
        ID_Ocupacion, Telefono,Email 
      )
      OUTPUT INSERTED.ID_DatosPadre 
      VALUES (
        @ID_Usuario, 
        @Nombre,
        @Apellido,
        @Dni, 
        @Telefono,
        @Email
      )
    `);

  return { id: result.recordset[0].ID_DatosPadre };
}


async function obtenerDatosPadre() {
  const pool = await poolPromise;
  const result = await pool.request()
    .query('SELECT * FROM DATOS_PADRE');
  return result.recordset;
}

async function obtenerDatosPadrePorId(id) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query('SELECT * FROM DATOS_PADRE WHERE ID_DatosPadre = @id');

  return result.recordset[0];
}

async function actualizarDatosPadre(id, datos) {
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
      UPDATE DATOS_PADRE
      SET 
          
          Nombre  = @Nombre,
          Apellido  = @Apellido,
          Dni = @Dni,
          Telefono = @Telefono,
          Email Cominicacion = @Email Cominicacion,
          ID_Ocupacion = @ID_Ocupacion,
        
      WHERE ID_DatosPadre = @id
    `);
}

async function eliminarDatosPadre(id) {
  const pool = await poolPromise;
  await pool.request()
    .input('id', sql.Int, id)
    .query('DELETE FROM DATOS_PADRE WHERE ID_DatosPadre = @id');
}

module.exports = {
  crearDatosPadre,
  obtenerDatosPadre,
  obtenerDatosPadrePorId,   
  actualizarDatosPadre,
  eliminarDatosPadre

};

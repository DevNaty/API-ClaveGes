const sql = require('mssql');
const { poolPromise } = require('../db');

async function crearDatosEscolaridad(datos) {
  const pool = await poolPromise;
  const request = pool.request();

  // Solo como ejemplo: se pueden incluir más campos
  const result = await request
    .input('ID_Usuario', sql.Int, datos.ID_Usuario)
    .input('ID_Escuela', sql.Int, datos.ID_Escuela)
    .input('ID_Grado', sql.Int, datos.ID_Grado)
    .input('ID_Turno', sql.Int, datos.ID_Turno)
    .input('ID_NivelEscolar', sql.Int, datos.ID_NivelEscolar)
    
      
    .query(`
      INSERT INTO DATOS_ESCOLARIDAD (
        ID_Usuario, 
        ID_Escuela,
        ID_Grado, 
        ID_Turno,  
        ID_NivelEscolar
    )
      OUTPUT INSERTED.ID_DatosEscolaridad
      VALUES (
        @ID_Usuario, 
        @ID_Escuela, 
        @ID_Grado, 
        @ID_Turno,
        @ID_NivelEscolar
      )
    `);

  return { id: result.recordset[0].ID_DatosEscolaridad };
}

async function obtenerDatosEscolaridad() {
  const pool = await poolPromise;
  const result = await pool.request()
    .query('SELECT * FROM DATOS_ESCOLARIDAD');
  return result.recordset;
}

async function obtenerDatosEscolaridadPorId(id) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query('SELECT * FROM DATOS_ESCOLARIDAD WHERE ID_DatosEscolaridad = @id');

  return result.recordset[0];
}

async function actualizarDatosEscolaridad(id, datos) {
  const pool = await poolPromise;
  const request = pool.request();

  // A modo de ejemplo solo actualiza algunos campos:
  await request
    .input('id', sql.Int, id)
    .input('ID_Escuela', sql.Int, datos.ID_Escuela)
    .input('ID_NivelEscolar', sql.Int, datos.ID_NivelEscolar)
    .input('ID_Grado', sql.Int, datos.ID_Grado)
    .input('ID_Turno', sql.Int, datos.ID_Turno)
    
    .query(`
      UPDATE DATOS_ESCOLARIDAD
      SET 
          
          ID_Escuela = @ID_Escuela,
          ID_NivelEscolar = @ID_NivelEscolar,
          ID_Grado = @ID_Grado,
          ID_Turno = @ID_Turno        

      WHERE ID_DatosEscolaridad = @id
    `);
}

async function eliminarDatosEscolaridad(id) {
  const pool = await poolPromise;
  await pool.request()
    .input('id', sql.Int, id)
    .query('DELETE FROM DATOS_ESCOLARIDAD WHERE ID_DatosEscolaridad = @id');
}

module.exports = {
  crearDatosEscolaridad,
  obtenerDatosEscolaridad,
  obtenerDatosEscolaridadPorId,
  actualizarDatosEscolaridad,
  eliminarDatosEscolaridad
};

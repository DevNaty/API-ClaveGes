const { poolPromise } = require('../db');
const sql = require('mssql');

// Obtener todas las categorías
const getNacionalidades = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM NACIONALIDADES');
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('❌ Error al obtener Nacionalidad:', error);
    res.status(500).json({ error: 'Error al obtener Nacionalidad' });
  }
};

// Obtener una categoría por ID
const getNacionalidadById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('ID_Nacionalidad', sql.Int, id)
      .query('SELECT * FROM NACIONALIDADES WHERE ID_Nacionalidad = @ID_Nacionalidad');

    if (result.recordset.length === 0) {
      return res.status(404).json({ mensaje: 'Nacionalidad no encontrada' });
    }

    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error('❌ Error al obtener Nacionalidad por ID:', error);
    res.status(500).json({ error: 'Error al obtener Nacionalidad' });
  }
};

// Crear una nueva categoría
const createNacionalidad = async (req, res) => {
  try {
    const { Descripcion } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('Descripcion', sql.VarChar, Descripcion)
      .query('INSERT INTO NACIONALIDADES (Descripcion) VALUES (@Descripcion)');

    res.status(201).json({ mensaje: 'Nacionalidad creada con éxito' });
  } catch (error) {
    console.error('❌ Error al crear Nacionalidad', error);
    res.status(500).json({ error: 'Error al crear Nacionalidad' });
  }
};

// Actualizar una categoría
const updateNacionalidad = async (req, res) => {
  try {
    const { id } = req.params;
    const { Descripcion } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('ID_Nacionalidad', sql.Int, id)
      .input('Descripcion', sql.VarChar, Descripcion)
      .query('UPDATE NACIONALIDADES SET Descripcion = @Descripcion WHERE ID_Nacionalidad = @ID_Nacionalidad');

    res.status(200).json({ mensaje: 'Nacionalidad actualizada con éxito' });
  } catch (error) {
    console.error('❌ Error al actualizar Nacionalidad', error);
    res.status(500).json({ error: 'Error al actualizar Nacionalidad' });
  }
};

// Eliminar una categoría
const deleteNacionalidad = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    await pool.request()
      .input('ID_Nacionalidad', sql.Int, id)
      .query('DELETE FROM NACIONALIDADES WHERE ID_Nacionalidad = @ID_Nacionalidad');

    res.status(200).json({ mensaje: 'Nacionalidad eliminada con éxito' });
  } catch (error) {
    console.error('❌ Error al eliminar Nacionalidad:', error);
    res.status(500).json({ error: 'Error al eliminar Nacionalidad' });
  }
};

module.exports = {
    getNacionalidades,
    getNacionalidadById,
    createNacionalidad,
    updateNacionalidad,
    deleteNacionalidad
};

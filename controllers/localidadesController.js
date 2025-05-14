const { poolPromise } = require('../db');
const sql = require('mssql');

// Obtener todas las categorías
const getLocalidades = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM LOCALIDADES');
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('❌ Error al obtener Localidad:', error);
    res.status(500).json({ error: 'Error al obtener Localidad' });
  }
};

// Obtener una categoría por ID
const getLocalidadById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('ID_Localidad', sql.Int, id)
      .query('SELECT * FROM LOCALIDADES WHERE ID_Localidad = @ID_Localidad');

    if (result.recordset.length === 0) {
      return res.status(404).json({ mensaje: 'Localidad no encontrada' });
    }

    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error('❌ Error al obtener Localidad por ID:', error);
    res.status(500).json({ error: 'Error al obtener Localidad' });
  }
};

// Crear una nueva categoría
const createLocalidad = async (req, res) => {
  try {
    const { Descripcion } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('Descripcion', sql.VarChar, Descripcion)
      .query('INSERT INTO LOCALIDADES (Descripcion) VALUES (@Descripcion)');

    res.status(201).json({ mensaje: 'Localidad creada con éxito' });
  } catch (error) {
    console.error('❌ Error al crear Localidad:', error);
    res.status(500).json({ error: 'Error al crear Localidad' });
  }
};

// Actualizar una categoría
const updateLocalidad = async (req, res) => {
  try {
    const { id } = req.params;
    const { Descripcion } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('ID_Localidad', sql.Int, id)
      .input('Descripcion', sql.VarChar, Descripcion)
      .query('UPDATE LOCALIDADES SET Descripcion = @Descripcion WHERE ID_Localidad = @ID_Localidad');

    res.status(200).json({ mensaje: 'Localidad actualizada con éxito' });
  } catch (error) {
    console.error('❌ Error al actualizar Localidad:', error);
    res.status(500).json({ error: 'Error al actualizar Localidad' });
  }
};

// Eliminar una categoría
const deleteLocalidad = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    await pool.request()
      .input('ID_Localidad', sql.Int, id)
      .query('DELETE FROM LOCALIDADES WHERE ID_Localidad = @ID_Localidad');

    res.status(200).json({ mensaje: 'Localidad eliminada con éxito' });
  } catch (error) {
    console.error('❌ Error al eliminar Localidad:', error);
    res.status(500).json({ error: 'Error al eliminar Localidad' });
  }
};

module.exports = {
    getLocalidades,
    getLocalidadById,
    createLocalidad,
    updateLocalidad,
    deleteLocalidad
};

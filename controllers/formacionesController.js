const { poolPromise } = require('../db');
const sql = require('mssql');

// Obtener todas las categorías
const getFormacion = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM FORMACIONES');
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('❌ Error al obtener Formación:', error);
    res.status(500).json({ error: 'Error al obtener Formación' });
  }
};

// Obtener una categoría por ID
const getFormacionById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('ID_Formacion', sql.Int, id)
      .query('SELECT * FROM FORMACIONES WHERE ID_Formacion = @ID_Formacion');

    if (result.recordset.length === 0) {
      return res.status(404).json({ mensaje: 'Formación no encontrada' });
    }

    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error('❌ Error al obtener Formación por ID:', error);
    res.status(500).json({ error: 'Error al obtener Formación' });
  }
};

// Crear una nueva categoría
const createFormacion = async (req, res) => {
  try {
    const { Descripcion } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('Descripcion', sql.VarChar, Descripcion)
      .query('INSERT INTO FORMACIONES (Descripcion) VALUES (@Descripcion)');

    res.status(201).json({ mensaje: 'Formación creada con éxito' });
  } catch (error) {
    console.error('❌ Error al crear Formación:', error);
    res.status(500).json({ error: 'Error al crear Formación' });
  }
};

// Actualizar una categoría
const updateFormacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { Descripcion } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('ID_Formacion', sql.Int, id)
      .input('Descripcion', sql.VarChar, Descripcion)
      .query('UPDATE FORMACIONES SET Descripcion = @Descripcion WHERE ID_Formacion = @ID_Formacion');

    res.status(200).json({ mensaje: 'Formación actualizada con éxito' });
  } catch (error) {
    console.error('❌ Error al actualizar Formación:', error);
    res.status(500).json({ error: 'Error al actualizar Formación' });
  }
};

// Eliminar una categoría
const deleteFormacion = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    await pool.request()
      .input('ID_Formacion', sql.Int, id)
      .query('DELETE FROM FORMACIONES WHERE ID_Formacion = @ID_Formacion ');

    res.status(200).json({ mensaje: 'Formación eliminada con éxito' });
  } catch (error) {
    console.error('❌ Error al eliminar Formación:', error);
    res.status(500).json({ error: 'Error al eliminar Formación' });
  }
};

module.exports = {
    getFormacion,
    getFormacionById,
    createFormacion,
    updateFormacion,
    deleteFormacion
};

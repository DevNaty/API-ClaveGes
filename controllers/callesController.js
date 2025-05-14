const { poolPromise } = require('../db');
const sql = require('mssql');

// Obtener todas las calles
const getCalles = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM CALLES');
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('❌ Error al obtener calles:', error);
    res.status(500).json({ error: 'Error al obtener calles' });
  }
};

// Obtener una calle por ID
const getCalleById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('ID_Calle', sql.Int, id)
      .query('SELECT * FROM CALLES WHERE ID_Calle = @ID_Calle');

    if (result.recordset.length === 0) {
      return res.status(404).json({ mensaje: 'Calle no encontrada' });
    }

    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error('❌ Error al obtener Calle por ID:', error);
    res.status(500).json({ error: 'Error al obtener Calle' });
  }
};

// Crear una nueva calle
const createCalle = async (req, res) => {
  try {
    const { Descripcion } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('Descripcion', sql.VarChar, Descripcion)
      .query('INSERT INTO CALLES (Descripcion) VALUES (@Descripcion)');

    res.status(201).json({ mensaje: 'Categoría creada con éxito' });
  } catch (error) {
    console.error('❌ Error al crear categoría:', error);
    res.status(500).json({ error: 'Error al crear categoría' });
  }
};

// Actualizar una calle
const updateCalle = async (req, res) => {
  try {
    const { id } = req.params;
    const { Descripcion } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('ID_Calle', sql.Int, id)
      .input('Descripcion', sql.VarChar, Descripcion)
      .query('UPDATE CALLES SET Descripcion = @Descripcion WHERE ID_Calle = @ID_Calle');

    res.status(200).json({ mensaje: 'Calle actualizada con éxito' });
  } catch (error) {
    console.error('❌ Error al actualizar calle:', error);
    res.status(500).json({ error: 'Error al actualizar calle' });
  }
};

// Eliminar una calle
const deleteCalle = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    await pool.request()
      .input('ID_Calle', sql.Int, id)
      .query('DELETE FROM CALLES WHERE ID_Calle = @ID_Calle');

    res.status(200).json({ mensaje: 'Calle eliminada con éxito' });
  } catch (error) {
    console.error('❌ Error al eliminar calle:', error);
    res.status(500).json({ error: 'Error al eliminar calle' });
  }
};

module.exports = {
  getCalles,
  getCalleById,
  createCalle,
  updateCalle,
  deleteCalle
};
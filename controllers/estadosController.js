const { poolPromise } = require('../db');
const sql = require('mssql');

// Obtener todas las categorías
const getEstado = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM ESTADOS');
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('❌ Error al obtener Estado:', error);
    res.status(500).json({ error: 'Error al obtener Estado' });
  }
};

// Obtener una categoría por ID
const getEstadoById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('ID_Estado', sql.Int, id)
      .query('SELECT * FROM ESTADOS WHERE ID_Estado = @ID_Estado');

    if (result.recordset.length === 0) {
      return res.status(404).json({ mensaje: 'Estado no encontrado' });
    }

    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error('❌ Error al obtener Estado por ID:', error);
    res.status(500).json({ error: 'Error al obtener Estado' });
  }
};

// Crear una nueva categoría
const createEstado = async (req, res) => {
  try {
    const { Descripcion } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('Descripcion', sql.VarChar, Descripcion)
      .query('INSERT INTO ESTADOS (Descripcion) VALUES (@Descripcion)');

    res.status(201).json({ mensaje: 'Estado creado con éxito' });
  } catch (error) {
    console.error('❌ Error al crear Estado:', error);
    res.status(500).json({ error: 'Error al crear Estado' });
  }
};

// Actualizar una categoría
const updateEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { Descripcion } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('ID_Estado', sql.Int, id)
      .input('Descripcion', sql.VarChar, Descripcion)
      .query('UPDATE ESTADOS SET Descripcion = @Descripcion WHERE ID_Estado = @ID_Estado');

    res.status(200).json({ mensaje: 'Estado actualizado con éxito' });
  } catch (error) {
    console.error('❌ Error al actualizar Estado:', error);
    res.status(500).json({ error: 'Error al actualizar Estado' });
  }
};

// Eliminar una categoría
const deleteEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    await pool.request()
      .input('ID_Estado', sql.Int, id)
      .query('DELETE FROM ESTADOS WHERE ID_Estado = @ID_Estado');

    res.status(200).json({ mensaje: 'Estado eliminado con éxito' });
  } catch (error) {
    console.error('❌ Error al eliminar Estado:', error);
    res.status(500).json({ error: 'Error al eliminar Estado' });
  }
};

module.exports = {
    getEstado,
    getEstadoById,
    createEstado,
    updateEstado,
    deleteEstado
};

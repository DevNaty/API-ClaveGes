const { poolPromise } = require('../db');
const sql = require('mssql');

// Obtener todas las categorías
const getEscuelas = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM ESCUELAS');
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('❌ Error al obtener Escuela:', error);
    res.status(500).json({ error: 'Error al obtener Escuela' });
  }
};

// Obtener una categoría por ID
const getEscuelaById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('ID_Escuela', sql.Int, id)
      .query('SELECT * FROM ESCUELAS WHERE ID_Escuela = @ID_Escuela');

    if (result.recordset.length === 0) {
      return res.status(404).json({ mensaje: 'Escuela no encontrada' });
    }

    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error('❌ Error al obtener Escuela por ID:', error);
    res.status(500).json({ error: 'Error al obtener Escuela' });
  }
};

// Crear una nueva categoría
const createEscuela = async (req, res) => {
  try {
    const { Descripcion } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('Descripcion', sql.VarChar, Descripcion)
      .query('INSERT INTO ESCUELAS (Descripcion) VALUES (@Descripcion)');

    res.status(201).json({ mensaje: 'Escuela creado con éxito' });
  } catch (error) {
    console.error('❌ Error al crear Escuela:', error);
    res.status(500).json({ error: 'Error al crear Escuela' });
  }
};

// Actualizar una categoría
const updateEscuela = async (req, res) => {
  try {
    const { id } = req.params;
    const { Descripcion } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('ID_Escuela', sql.Int, id)
      .input('Descripcion', sql.VarChar, Descripcion)
      .query('UPDATE ESCUELAS SET Descripcion = @Descripcion WHERE ID_Escuela = @ID_Escuela');

    res.status(200).json({ mensaje: 'Escuela actualizada con éxito' });
  } catch (error) {
    console.error('❌ Error al actualizar Escuela:', error);
    res.status(500).json({ error: 'Error al actualizar Escuela' });
  }
};

// Eliminar una categoría
const deleteEscuela = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    await pool.request()
      .input('ID_Escuela', sql.Int, id)
      .query('DELETE FROM ESCUELAS WHERE ID_Escuela = @ID_Escuela');

    res.status(200).json({ mensaje: 'Escuela eliminada con éxito' });
  } catch (error) {
    console.error('❌ Error al eliminar Escuela:', error);
    res.status(500).json({ error: 'Error al eliminar Escuela' });
  }
};

module.exports = {
    getEscuelas,
    getEscuelaById,
    createEscuela,
    updateEscuela,
    deleteEscuela
};

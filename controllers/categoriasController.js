const { poolPromise } = require('../db');
const sql = require('mssql');

// Obtener todas las categorías
const getCategorias = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM CATEGORIAS');
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('❌ Error al obtener categorías:', error);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
};

// Obtener una categoría por ID
const getCategoriaById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('ID_Categoria', sql.Int, id)
      .query('SELECT * FROM CATEGORIAS WHERE ID_Categoria = @ID_Categoria');

    if (result.recordset.length === 0) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    }

    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error('❌ Error al obtener categoría por ID:', error);
    res.status(500).json({ error: 'Error al obtener categoría' });
  }
};

// Crear una nueva categoría
const createCategoria = async (req, res) => {
  try {
    const { Descripcion } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('Descripcion', sql.VarChar, Descripcion)
      .query('INSERT INTO CATEGORIAS (Descripcion) VALUES (@Descripcion)');

    res.status(201).json({ mensaje: 'Categoría creada con éxito' });
  } catch (error) {
    console.error('❌ Error al crear categoría:', error);
    res.status(500).json({ error: 'Error al crear categoría' });
  }
};

// Actualizar una categoría
const updateCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { Descripcion } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('ID_Categoria', sql.Int, id)
      .input('Descripcion', sql.VarChar, Descripcion)
      .query('UPDATE CATEGORIAS SET Descripcion = @Descripcion WHERE ID_Categoria = @ID_Categoria');

    res.status(200).json({ mensaje: 'Categoría actualizada con éxito' });
  } catch (error) {
    console.error('❌ Error al actualizar categoría:', error);
    res.status(500).json({ error: 'Error al actualizar categoría' });
  }
};

// Eliminar una categoría
const deleteCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    await pool.request()
      .input('ID_Categoria', sql.Int, id)
      .query('DELETE FROM CATEGORIAS WHERE ID_Categoria = @ID_Categoria');

    res.status(200).json({ mensaje: 'Categoría eliminada con éxito' });
  } catch (error) {
    console.error('❌ Error al eliminar categoría:', error);
    res.status(500).json({ error: 'Error al eliminar categoría' });
  }
};

module.exports = {
  getCategorias,
  getCategoriaById,
  createCategoria,
  updateCategoria,
  deleteCategoria
};

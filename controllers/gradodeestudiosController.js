const { poolPromise } = require('../db');
const sql = require('mssql');

// Obtener todas las categorías
const getGradoEstudioObtenido = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM GRADO_DE_ESTUDIOS');
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('❌ Error al obtener Grado de estudio:', error);
    res.status(500).json({ error: 'Error al obtener Grado de estudio' });
  }
};

// Obtener una categoría por ID
const getGradoEstudioObtenidoByID = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('ID_GradoEstudioObtenido', sql.Int, id)
      .query('SELECT * FROM GRADO_DE_ESTUDIOS WHERE ID_GradoEstudioObtenido = @ID_GradoEstudioObtenido');

    if (result.recordset.length === 0) {
      return res.status(404).json({ mensaje: 'Grado de estudio no encontrado' });
    }

    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error('❌ Error al obtener Grado de estudio por ID:', error);
    res.status(500).json({ error: 'Error al obtener Grado de estudio' });
  }
};

// Crear una nueva categoría
const createGradoEstudioObtenido = async (req, res) => {
  try {
    const { Descripcion } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('Descripcion', sql.VarChar, Descripcion)
      .query('INSERT INTO GRADO_DE_ESTUDIOS (Descripcion) VALUES (@Descripcion)');

    res.status(201).json({ mensaje: 'Grado de estudio creado con éxito' });
  } catch (error) {
    console.error('❌ Error al crear Grado de estudio:', error);
    res.status(500).json({ error: 'Error al crear Grado de estudio' });
  }
};

// Actualizar una categoría
const updateGradoEstudioObtenido = async (req, res) => {
  try {
    const { id } = req.params;
    const { Descripcion } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('ID_GradoEstudioObtenido', sql.Int, id)
      .input('Descripcion', sql.VarChar, Descripcion)
      .query('UPDATE GRADO_DE_ESTUDIOS SET Descripcion = @Descripcion WHERE ID_GradoEstudioObtenido = @ID_GradoEstudioObtenido');

    res.status(200).json({ mensaje: 'Grado de estudio actualizado con éxito' });
  } catch (error) {
    console.error('❌ Error al actualizar Grado de estudio:', error);
    res.status(500).json({ error: 'Error al actualizar Grado de estudio' });
  }
};

// Eliminar una categoría
const deleteGradoEstudioObtenido = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    await pool.request()
      .input('ID_GradoEstudioObtenido', sql.Int, id)
      .query('DELETE FROM GRADO_DE_ESTUDIOS WHERE ID_GradoEstudioObtenido = @ID_GradoEstudioObtenido');

    res.status(200).json({ mensaje: 'Grado de estudio eliminado con éxito' });
  } catch (error) {
    console.error('❌ Error al eliminar Grado de estudio:', error);
    res.status(500).json({ error: 'Error al eliminar Grado de estudio' });
  }
};

module.exports = {
    getGradoEstudioObtenido,
    getGradoEstudioObtenidoByID,
    createGradoEstudioObtenido,
    updateGradoEstudioObtenido,
    deleteGradoEstudioObtenido
};

const { poolPromise } = require('../db');
const sql = require('mssql');

// Obtener todas las categorías
const getNivel= async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM NIVELES');
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('❌ Error al obtener Nivel:', error);
    res.status(500).json({ error: 'Error al obtener Nivel' });
  }
};

// Obtener una categoría por ID
const getNivelById= async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('ID_Nivel', sql.Int, id)
      .query('SELECT * FROM NIVELES WHERE ID_Nivel = @ID_Nivel');

    if (result.recordset.length === 0) {
      return res.status(404).json({ mensaje: 'Nivel no encontrado' });
    }

    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error('❌ Error al obtener Nivel por ID:', error);
    res.status(500).json({ error: 'Error al obtener Nivel' });
  }
};

// Crear una nueva categoría
const createNivel= async (req, res) => {
  try {
    const { Descripcion } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('Descripcion', sql.VarChar, Descripcion)
      .query('INSERT INTO NIVELES (Descripcion) VALUES (@Descripcion)');

    res.status(201).json({ mensaje: 'Nivel creado con éxito' });
  } catch (error) {
    console.error('❌ Error al crear Nivel:', error);
    res.status(500).json({ error: 'Error al crear Nivel' });
  }
};

// Actualizar una categoría
const updateNivel = async (req, res) => {
  try {
    const { id } = req.params;
    const { Descripcion } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('ID_Nivel', sql.Int, id)
      .input('Descripcion', sql.VarChar, Descripcion)
      .query('UPDATE NIVELES SET Descripcion = @Descripcion WHERE ID_Nivel = @ID_Nivel');

    res.status(200).json({ mensaje: 'Nivel actualizado con éxito' });
  } catch (error) {
    console.error('❌ Error al actualizar Nivel:', error);
    res.status(500).json({ error: 'Error al actualizar Nivel' });
  }
};

// Eliminar una categoría
const deleteNivel = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    await pool.request()
      .input('ID_Nivel', sql.Int, id)
      .query('DELETE FROM NIVELES WHERE ID_Nivel = @ID_Nivel');

    res.status(200).json({ mensaje: 'Nivel eliminado con éxito' });
  } catch (error) {
    console.error('❌ Error al eliminar Nivel:', error);
    res.status(500).json({ error: 'Error al eliminar Nivel' });
  }
};

module.exports = {
    getNivel,
    getNivelById,
    createNivel,
    updateNivel,
    deleteNivel
};

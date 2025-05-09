const { poolPromise } = require('../db');
const sql = require('mssql');

// Obtener todas las categorías
const getCargaHoraria = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM CARGAHORARIAS');
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('❌ Error al obtener Carga Horaria:', error);
    res.status(500).json({ error: 'Error al obtener Carga Horaria' });
  }
};

// Obtener una categoría por ID
const getCargaHorariaById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('ID_CargaHoraria', sql.Int, id)
      .query('SELECT * FROM CARGAHORARIAS WHERE ID_CargaHoraria = @ID_CargaHoraria');

    if (result.recordset.length === 0) {
      return res.status(404).json({ mensaje: 'Carga Horaria no encontrada' });
    }

    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error('❌ Error al obtener Carga Horaria por ID:', error);
    res.status(500).json({ error: 'Error al obtener Carga Horaria' });
  }
};

// Crear una nueva categoría
const createCargaHoraria = async (req, res) => {
  try {
    const { Descripcion } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('Descripcion', sql.VarChar, Descripcion)
      .query('INSERT INTO CARGAHORARIAS (Descripcion) VALUES (@Descripcion)');

    res.status(201).json({ mensaje: 'Carga Horaria creada con éxito' });
  } catch (error) {
    console.error('❌ Error al crear Carga Horaria:', error);
    res.status(500).json({ error: 'Error al crear Carga Horaria' });
  }
};

// Actualizar una categoría
const updateCargaHoraria = async (req, res) => {
  try {
    const { id } = req.params;
    const { Descripcion } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('ID_CargaHoraria', sql.Int, id)
      .input('Descripcion', sql.VarChar, Descripcion)
      .query('UPDATE CARGAHORARIAS SET Descripcion = @Descripcion WHERE ID_CargaHoraria = @ID_CargaHoraria');

    res.status(200).json({ mensaje: 'Carga Horaria actualizada con éxito' });
  } catch (error) {
    console.error('❌ Error al actualizar Carga Horaria:', error);
    res.status(500).json({ error: 'Error al actualizar Carga Horaria' });
  }
};

// Eliminar una categoría
const deleteCargaHoraria = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    await pool.request()
      .input('ID_CargaHoraria', sql.Int, id)
      .query('DELETE FROM CARGAHORARIAS WHERE ID_CargaHoraria = @ID_CargaHoraria');

    res.status(200).json({ mensaje: 'Carga Horaria eliminada con éxito' });
  } catch (error) {
    console.error('❌ Error al eliminar Carga Horaria:', error);
    res.status(500).json({ error: 'Error al eliminar Carga Horaria' });
  }
};

module.exports = {
  getCargaHoraria,
  getCargaHorariaById,
  createCargaHoraria,
  updateCargaHoraria,
  deleteCargaHoraria
};

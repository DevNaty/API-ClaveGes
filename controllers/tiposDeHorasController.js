const { poolPromise } = require('../db');
const sql = require('mssql');

// Obtener todas las categorías
const getTipoHora= async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM TIPOSDEHORAS');
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('❌ Error al obtener Tipo de Hora:', error);
    res.status(500).json({ error: 'Error al obtener Tipo de Hora' });
  }
};

// Obtener una categoría por ID
const getTipoHoraById= async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('ID_TipoHora', sql.Int, id)
      .query('SELECT * FROM TIPOSDEHORAS WHERE ID_TipoHora = @ID_TipoHora');

    if (result.recordset.length === 0) {
      return res.status(404).json({ mensaje: 'Tipo de Hora no encontrada' });
    }

    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error('❌ Error al obtener Tipo de Hora por ID:', error);
    res.status(500).json({ error: 'Error al obtener Tipo de Hora' });
  }
};

// Crear una nueva categoría
const createTipoHora= async (req, res) => {
  try {
    const { Descripcion } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('Descripcion', sql.VarChar, Descripcion)
      .query('INSERT INTO TIPOSDEHORAS (Descripcion) VALUES (@Descripcion)');

    res.status(201).json({ mensaje: 'Tipo de Hora creada con éxito' });
  } catch (error) {
    console.error('❌ Error al crear Tipo de Hora:', error);
    res.status(500).json({ error: 'Error al crear Tipo de Hora' });
  }
};

// Actualizar una categoría
const updateTipoHora = async (req, res) => {
  try {
    const { id } = req.params;
    const { Descripcion } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('ID_TipoHora', sql.Int, id)
      .input('Descripcion', sql.VarChar, Descripcion)
      .query('UPDATE TIPOSDEHORAS SET Descripcion = @Descripcion WHERE ID_TipoHora = @ID_TipoHora');

    res.status(200).json({ mensaje: 'Tipo de Hora actualizada con éxito' });
  } catch (error) {
    console.error('❌ Error al actualizar Tipo de Hora:', error);
    res.status(500).json({ error: 'Error al actualizar Tipo de Hora' });
  }
};

// Eliminar una categoría
const deleteTipoHora = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    await pool.request()
      .input('ID_TipoHora', sql.Int, id)
      .query('DELETE FROM TIPOSDEHORAS WHERE ID_TipoHora = @ID_TipoHora');

    res.status(200).json({ mensaje: 'Tipo de Hora eliminada con éxito' });
  } catch (error) {
    console.error('❌ Error al eliminar Tipo de Hora:', error);
    res.status(500).json({ error: 'Error al eliminar Tipo de Hora' });
  }
};

module.exports = {
    getTipoHora,
    getTipoHoraById,
    createTipoHora,
    updateTipoHora,
    deleteTipoHora
};

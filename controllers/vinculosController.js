const { poolPromise } = require('../db');
const sql = require('mssql');

// Obtener todas las categorías
const getVinculos = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM VINCULOS');
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('❌ Error al obtener Vinculo', error);
    res.status(500).json({ error: 'Error al obtener Vinculo' });
  }
};

// Obtener una categoría por ID
const getVinculoById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('ID_Vinculo', sql.Int, id)
      .query('SELECT * FROM VINCULOS WHERE ID_Vinculo = @ID_Vinculo');

    if (result.recordset.length === 0) {
      return res.status(404).json({ mensaje: 'Vinculo no encontrado' });
    }

    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error('❌ Error al obtener Vinculo por ID', error);
    res.status(500).json({ error: 'Error al obtener Vinculo' });
  }
};

// Crear una nueva categoría
const createVinculo = async (req, res) => {
  try {
    const { Descripcion } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('Descripcion', sql.VarChar, Descripcion)
      .query('INSERT INTO VINCULOS (Descripcion) VALUES (@Descripcion)');

    res.status(201).json({ mensaje: 'Vinculo creado con éxito' });
  } catch (error) {
    console.error('❌ Error al crear Vinculo', error);
    res.status(500).json({ error: 'Error al crear Vinculo' });
  }
};

// Actualizar una categoría
const updateVinculo = async (req, res) => {
  try {
    const { id } = req.params;
    const { Descripcion } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('ID_Vinculo', sql.Int, id)
      .input('Descripcion', sql.VarChar, Descripcion)
      .query('UPDATE VINCULOS SET Descripcion = @Descripcion WHERE ID_Vinculo = @ID_Vinculo');

    res.status(200).json({ mensaje: 'Vinculo actualizado con éxito' });
  } catch (error) {
    console.error('❌ Error al actualizar Vinculo', error);
    res.status(500).json({ error: 'Error al actualizar Vinculo' });
  }
};

// Eliminar una categoría
const deleteVinculo = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    await pool.request()
      .input('ID_Vinculo', sql.Int, id)
      .query('DELETE FROM VINCULOS WHERE ID_Vinculo = @ID_Vinculo');

    res.status(200).json({ mensaje: 'Vinculo eliminado con éxito' });
  } catch (error) {
    console.error('❌ Error al eliminar Vinculo', error);
    res.status(500).json({ error: 'Error al eliminar Vinculo' });
  }
};

module.exports = {
    getVinculos,
    getVinculoById,
    createVinculo,
    updateVinculo,
    deleteVinculo
};

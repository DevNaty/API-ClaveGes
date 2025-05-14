const { poolPromise } = require('../db');
const sql = require('mssql');

// Obtener todas las categorías
const getOcupaciones = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM OCUPACIONES');
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('❌ Error al obtener Ocupacion', error);
    res.status(500).json({ error: 'Error al obtener Ocupacion' });
  }
};

// Obtener una categoría por ID
const getOcupacionById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('ID_Ocupacion', sql.Int, id)
      .query('SELECT * FROM OCUPACIONES WHERE ID_Ocupacion = @ID_Ocupacion');

    if (result.recordset.length === 0) {
      return res.status(404).json({ mensaje: 'Ocupacion no encontrada' });
    }

    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error('❌ Error al obtener Ocupacion por ID', error);
    res.status(500).json({ error: 'Error al obtener Ocupacion' });
  }
};

// Crear una nueva categoría
const createOcupacion = async (req, res) => {
  try {
    const { Descripcion } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('Descripcion', sql.VarChar, Descripcion)
      .query('INSERT INTO OCUPACIONES (Descripcion) VALUES (@Descripcion)');

    res.status(201).json({ mensaje: 'Ocupacion creado con éxito' });
  } catch (error) {
    console.error('❌ Error al crear Ocupacion', error);
    res.status(500).json({ error: 'Error al crear Ocupacion' });
  }
};

// Actualizar una categoría
const updateOcupacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { Descripcion } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('ID_Ocupacion', sql.Int, id)
      .input('Descripcion', sql.VarChar, Descripcion)
      .query('UPDATE OCUPACIONES SET Descripcion = @Descripcion WHERE ID_Ocupacion = @ID_Ocupacion');

    res.status(200).json({ mensaje: 'Ocupacion actualizada con éxito' });
  } catch (error) {
    console.error('❌ Error al actualizar Ocupacion', error);
    res.status(500).json({ error: 'Error al actualizar Ocupacion' });
  }
};

// Eliminar una categoría
const deleteOcupacion = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    await pool.request()
      .input('ID_Ocupacion', sql.Int, id)
      .query('DELETE FROM OCUPACIONES WHERE ID_Ocupacion = @ID_Ocupacion');

    res.status(200).json({ mensaje: 'Ocupacion eliminada con éxito' });
  } catch (error) {
    console.error('❌ Error al eliminar Ocupacion', error);
    res.status(500).json({ error: 'Error al eliminar Ocupacion' });
  }
};

module.exports = {
    getOcupaciones,
    getOcupacionById,
    createOcupacion,
    updateOcupacion,
    deleteOcupacion
};

const { poolPromise } = require('../db');
const sql = require('mssql');

// Obtener todas las categorías
const getInstrumentos = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM INSTRUMENTOS');
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('❌ Error al obtener Instrumentos:', error);
    res.status(500).json({ error: 'Error al obtener Instrumentos' });
  }
};

// Obtener una categoría por ID
const getInstrumentoById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('ID_Instrumento', sql.Int, id)
      .query('SELECT * FROM INSTRUMENTOS WHERE ID_Instrumento = @ID_Instrumento');

    if (result.recordset.length === 0) {
      return res.status(404).json({ mensaje: 'Instrumento no encontrado' });
    }

    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error('❌ Error al obtener Instrumento por ID:', error);
    res.status(500).json({ error: 'Error al obtener Instrumento' });
  }
};

// Crear una nueva categoría
const createInstrumento = async (req, res) => {
  try {
    const { Descripcion } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('Descripcion', sql.VarChar, Descripcion)
      .query('INSERT INTO INSTRUMENTOS (Descripcion) VALUES (@Descripcion)');

    res.status(201).json({ mensaje: 'Instrumento creado con éxito' });
  } catch (error) {
    console.error('❌ Error al crear Instrumento:', error);
    res.status(500).json({ error: 'Error al crear Instrumento' });
  }
};

// Actualizar una categoría
const updateInstrumento = async (req, res) => {
  try {
    const { id } = req.params;
    const { Descripcion } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('ID_Instrumento', sql.Int, id)
      .input('Descripcion', sql.VarChar, Descripcion)
      .query('UPDATE INSTRUMENTOS SET Descripcion = @Descripcion WHERE ID_Instrumento = @ID_Instrumento');

    res.status(200).json({ mensaje: 'Instrumento actualizado con éxito' });
  } catch (error) {
    console.error('❌ Error al actualizar Instrumento:', error);
    res.status(500).json({ error: 'Error al actualizar Instrumento' });
  }
};

// Eliminar una categoría
const deleteInstrumento = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    await pool.request()
      .input('ID_Instrumento', sql.Int, id)
      .query('DELETE FROM INSTRUMENTOS WHERE ID_Instrumento = @ID_Instrumento');

    res.status(200).json({ mensaje: 'Instrumento eliminado con éxito' });
  } catch (error) {
    console.error('❌ Error al eliminar Instrumento:', error);
    res.status(500).json({ error: 'Error al eliminar Instrumento' });
  }
};

module.exports = {
    getInstrumentos,
    getInstrumentoById,
    createInstrumento,
    updateInstrumento,
    deleteInstrumento
};

const { poolPromise } = require('../db');
const sql = require('mssql');

// Obtener todas las categorías
const getNivelesEscolares= async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM NIVELES_ACADEMICOS');
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('❌ Error al obtener Nivel Escolar', error);
    res.status(500).json({ error: 'Error al obtener Nivel Escolar' });
  }
};

// Obtener una categoría por ID
const getNivelEscolarById= async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('ID_NivelEscolar', sql.Int, id)
      .query('SELECT * FROM NIVELES_ACADEMICOS WHERE ID_NivelEscolar = @ID_NivelEscolar');

    if (result.recordset.length === 0) {
      return res.status(404).json({ mensaje: 'Nivel Escolar no encontrado' });
    }

    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error('❌ Error al obtener Nivel Escolar por ID', error);
    res.status(500).json({ error: 'Error al obtener Nivel Escolar' });
  }
};

// Crear una nueva categoría
const createNivelEscolar= async (req, res) => {
  try {
    const { Descripcion } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('Descripcion', sql.VarChar, Descripcion)
      .query('INSERT INTO NIVELES_ACADEMICOS (Descripcion) VALUES (@Descripcion)');

    res.status(201).json({ mensaje: 'Nivel Escolar creado con éxito' });
  } catch (error) {
    console.error('❌ Error al crear Nivel Escolar', error);
    res.status(500).json({ error: 'Error al crear Nivel Escolar' });
  }
};

// Actualizar una categoría
const updateNivelEscolar = async (req, res) => {
  try {
    const { id } = req.params;
    const { Descripcion } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('ID_NivelEscolar', sql.Int, id)
      .input('Descripcion', sql.VarChar, Descripcion)
      .query('UPDATE NIVELES_ACADEMICOS SET Descripcion = @Descripcion WHERE ID_NivelEscolar = @ID_NivelEscolar');

    res.status(200).json({ mensaje: 'Nivel Escolar actualizado con éxito' });
  } catch (error) {
    console.error('❌ Error al actualizar Nivel Escolar', error);
    res.status(500).json({ error: 'Error al actualizar Nivel Escolar' });
  }
};

// Eliminar una categoría
const deleteNivelEscolar = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    await pool.request()
      .input('ID_NivelEscolar', sql.Int, id)
      .query('DELETE FROM NIVELES_ACADEMICOS WHERE ID_NivelEscolar = @ID_NivelEscolar');

    res.status(200).json({ mensaje: 'Nivel Escolar eliminado con éxito' });
  } catch (error) {
    console.error('❌ Error al eliminar Nivel Escolar', error);
    res.status(500).json({ error: 'Error al eliminar Nivel Escolar' });
  }
};

module.exports = {
    getNivelesEscolares,
    getNivelEscolarById,
    createNivelEscolar,
    updateNivelEscolar,
    deleteNivelEscolar
};

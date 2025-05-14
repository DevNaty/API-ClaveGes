const { poolPromise } = require('../db');
const sql = require('mssql');

// Obtener todas las categorías
const getGradosEscolares = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM GRADOS_ESCOLARES');
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('❌ Error al obtener Grado escolar:', error);
    res.status(500).json({ error: 'Error al obtener Grado escolar' });
  }
};

// Obtener una categoría por ID
const getGradoEscolarByID = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('ID_Grado', sql.Int, id)
      .query('SELECT * FROM GRADOS_ESCOLARES WHERE ID_Grado = @ID_Grado');

    if (result.recordset.length === 0) {
      return res.status(404).json({ mensaje: 'Grado escolar no encontrado' });
    }

    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error('❌ Error al obtener Grado escolar por ID:', error);
    res.status(500).json({ error: 'Error al obtener Grado escolar' });
  }
};

// Crear una nueva categoría
const createGradoEscolar = async (req, res) => {
  try {
    const { Descripcion } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('Descripcion', sql.VarChar, Descripcion)
      .query('INSERT INTO GRADOS_ESCOLARES (Descripcion) VALUES (@Descripcion)');

    res.status(201).json({ mensaje: 'Grado escolar creado con éxito' });
  } catch (error) {
    console.error('❌ Error al crear Grado escolar', error);
    res.status(500).json({ error: 'Error al crear Grado escolar' });
  }
};

// Actualizar una categoría
const updateGradoEscolar = async (req, res) => {
  try {
    const { id } = req.params;
    const { Descripcion } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('ID_Grado', sql.Int, id)
      .input('Descripcion', sql.VarChar, Descripcion)
      .query('UPDATE GRADOS_ESCOLARES SET Descripcion = @Descripcion WHERE ID_Grado = @ID_Grado');

    res.status(200).json({ mensaje: 'Grado escolar actualizado con éxito' });
  } catch (error) {
    console.error('❌ Error al actualizar Grado escolar', error);
    res.status(500).json({ error: 'Error al actualizar Grado escolar' });
  }
};

// Eliminar una categoría
const deleteGradoEscolar = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    await pool.request()
      .input('ID_Grado', sql.Int, id)
      .query('DELETE FROM GRADOS_ESCOLARES WHERE ID_Grado = @ID_Grado');

    res.status(200).json({ mensaje: 'Grado escolar eliminado con éxito' });
  } catch (error) {
    console.error('❌ Error al eliminar Grado escolar', error);
    res.status(500).json({ error: 'Error al eliminar Grado escolar' });
  }
};

module.exports = {
    getGradosEscolares,
    getGradoEscolarByID,
    createGradoEscolar,
    updateGradoEscolar,
    deleteGradoEscolar
};

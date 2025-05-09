const { poolPromise } = require('../db');
const sql = require('mssql');

// Obtener todas las categorías
const getCiclo = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM CICLOS');
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('❌ Error al obtener Ciclos:', error);
    res.status(500).json({ error: 'Error al obtener Ciclos' });
  }
};

// Obtener una categoría por ID
const getCicloById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('ID_Ciclo', sql.Int, id)
      .query('SELECT * FROM CICLOS WHERE ID_Ciclo = @ID_Ciclo');

    if (result.recordset.length === 0) {
      return res.status(404).json({ mensaje: 'Ciclo no encontrado' });
    }

    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error('❌ Error al obtener ciclo por ID:', error);
    res.status(500).json({ error: 'Error al obtener ciclo' });
  }
};

// Crear una nueva categoría
const createCiclo = async (req, res) => {
  try {
    const { Descripcion } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('Descripcion', sql.VarChar, Descripcion)
      .query('INSERT INTO CICLOS (Descripcion) VALUES (@Descripcion)');

    res.status(201).json({ mensaje: 'Ciclo creado con éxito' });
  } catch (error) {
    console.error('❌ Error al crear Ciclo:', error);
    res.status(500).json({ error: 'Error al crear Ciclo' });
  }
};

// Actualizar una categoría
const updateCiclo = async (req, res) => {
  try {
    const { id } = req.params;
    const { Descripcion } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('ID_Ciclo', sql.Int, id)
      .input('Descripcion', sql.VarChar, Descripcion)
      .query('UPDATE CICLOS SET Descripcion = @Descripcion WHERE ID_Ciclo = @ID_Ciclo');

    res.status(200).json({ mensaje: 'Ciclo actualizado con éxito' });
  } catch (error) {
    console.error('❌ Error al actualizar ciclo:', error);
    res.status(500).json({ error: 'Error al actualizar ciclo' });
  }
};

// Eliminar una categoría
const deleteCiclo = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    await pool.request()
      .input('ID_Ciclo', sql.Int, id)
      .query('DELETE FROM CICLOS WHERE ID_Ciclo = @ID_Ciclo');

    res.status(200).json({ mensaje: 'Ciclo eliminado con éxito' });
  } catch (error) {
    console.error('❌ Error al eliminar ciclo:', error);
    res.status(500).json({ error: 'Error al eliminar ciclo' });
  }
};

module.exports = {
    getCiclo,
    getCicloById,
    createCiclo,
    updateCiclo,
    deleteCiclo
};

const { poolPromise } = require('../db');
const sql = require('mssql');

// Obtener todas las categorías
const getTurnos = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM TURNOS_ESCOLARES');
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('❌ Error al obtener Turno', error);
    res.status(500).json({ error: 'Error al obtener Turno' });
  }
};

// Obtener una categoría por ID
const getTurnoById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('ID_Turno', sql.Int, id)
      .query('SELECT * FROM TURNOS_ESCOLARES WHERE ID_Turno = @ID_Turno');

    if (result.recordset.length === 0) {
      return res.status(404).json({ mensaje: 'Turno no encontrado' });
    }

    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error('❌ Error al obtener Turno por ID:', error);
    res.status(500).json({ error: 'Error al obtener Turno' });
  }
};

// Crear una nueva categoría
const createTurno = async (req, res) => {
  try {
    const { Descripcion } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('Descripcion', sql.VarChar, Descripcion)
      .query('INSERT INTO TURNOS_ESCOLARES (Descripcion) VALUES (@Descripcion)');

    res.status(201).json({ mensaje: 'Turno creado con éxito' });
  } catch (error) {
    console.error('❌ Error al crear Turno:', error);
    res.status(500).json({ error: 'Error al crear Turno' });
  }
};

// Actualizar una categoría
const updateTurno = async (req, res) => {
  try {
    const { id } = req.params;
    const { Descripcion } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('ID_Turno', sql.Int, id)
      .input('Descripcion', sql.VarChar, Descripcion)
      .query('UPDATE TURNOS_ESCOLARES SET Descripcion = @Descripcion WHERE ID_Turno = @ID_Turno');

    res.status(200).json({ mensaje: 'Turno actualizado con éxito' });
  } catch (error) {
    console.error('❌ Error al actualizar Turno', error);
    res.status(500).json({ error: 'Error al actualizar Turno' });
  }
};

// Eliminar una categoría
const deleteTurno = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    await pool.request()
      .input('ID_Turno', sql.Int, id)
      .query('DELETE FROM TURNOS_ESCOLARES WHERE ID_Turno = @ID_Turno');

    res.status(200).json({ mensaje: 'Turno eliminado con éxito' });
  } catch (error) {
    console.error('❌ Error al eliminar Turno:', error);
    res.status(500).json({ error: 'Error al eliminar Turno' });
  }
};

module.exports = {
    getTurnos,
    getTurnoById,
    createTurno,
    updateTurno,
    deleteTurno
};

const { poolPromise } = require('../db');
const sql = require('mssql');

const getEspacios = async (req, res) => {
    try {
      const pool = await poolPromise;
      const result = await pool.request().query('SELECT * FROM ESPACIOSCURRICULARES');
      res.json(result.recordset);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener espacios curriculares' });
    }
  };
  const getEspacioPorId = async (req, res) => {
    const { id } = req.params;
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM ESPACIOSCURRICULARES WHERE ID_EspacioCurricular = @id');
      if (result.recordset.length === 0) {
        return res.status(404).json({ error: 'Espacio no encontrado' });
      }
      res.json(result.recordset[0]);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener espacio curricular' });
    }
  };
  const getEspaciosDetallado = async (req, res) => {
    try {
      const pool = await poolPromise;
      const result = await pool.request().query(`
        SELECT
            ec.ID_EspacioCurricular,
            ec.Descripcion AS EspacioCurricular,
            th.Descripcion AS TiposDeHoras,
            e.Descripcion AS Estado,
            ec.CargaHoraria,
            c.Descripcion AS Ciclo,
            f.Descripcion AS Formacion,
            n.Descripcion AS Nivel
            FROM
            ESPACIOSCURRICULARES ec
            LEFT JOIN TIPOSDEHORAS th ON ec.ID_TipoHora = th.ID_TipoHora
            LEFT JOIN ESTADOS e ON ec.ID_Estado = e.ID_Estado
            LEFT JOIN CICLOS c ON ec.ID_Ciclo = c.ID_Ciclo
            LEFT JOIN FORMACIONES f ON ec.ID_Formacion = f.ID_Formacion
            LEFT JOIN NIVELES n ON ec.ID_Nivel = n.ID_Nivel

      `);
      res.json(result.recordset);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener espacios curriculares detallados' });
    }
  };
  
  const createEspacio = async (req, res) => {
    const { Descripcion, CargaHoraria,ID_TipoHora, ID_Estado, ID_Ciclo, ID_Formacion, ID_Nivel } = req.body;
    try {
      const pool = await poolPromise;
      await pool.request()
        .input('Descripcion', sql.VarChar(100), Descripcion)
        .input('CargaHoraria', sql.VarChar(50), CargaHoraria)
        .input('ID_TipoHora', sql.Int, ID_TipoHora)
        .input('ID_Estado', sql.Int, ID_Estado)
        .input('ID_Ciclo', sql.Int, ID_Ciclo)
        .input('ID_Formacion', sql.Int, ID_Formacion)
        .input('ID_Nivel', sql.Int, ID_Nivel)
        .query(`
          INSERT INTO ESPACIOSCURRICULARES (Descripcion, CargaHoraria, ID_TipoHora, ID_Estado, ID_Ciclo, ID_Formacion, ID_Nivel)
          VALUES (@Descripcion, @CargaHoraria, @ID_TipoHora, @ID_Estado, @ID_Ciclo, @ID_Formacion, @ID_Nivel)
        `);
      res.status(201).json({ mensaje: 'Espacio curricular creado exitosamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear espacio curricular' });
    }
  };
  const updateEspacio = async (req, res) => {
    const { id } = req.params;
    const { Descripcion, ID_TipoHora, ID_Estado, CargaHoraria, ID_Ciclo, ID_Formacion, ID_Nivel } = req.body;
    try {
      const pool = await poolPromise;
      await pool.request()
        .input('id', sql.Int, id)
        .input('Descripcion', sql.VarChar(100), Descripcion)
        .input('ID_TipoHora', sql.Int, ID_TipoHora)
        .input('ID_Estado', sql.Int, ID_Estado)
        .input('CargaHoraria', sql.VarChar(50), CargaHoraria)
        .input('ID_Ciclo', sql.Int, ID_Ciclo)
        .input('ID_Formacion', sql.Int, ID_Formacion)
        .input('ID_Nivel', sql.Int, ID_Nivel)
        .query(`
          UPDATE ESPACIOSCURRICULARES
          SET Descripcion = @Descripcion,
              ID_TipoHora = @ID_TipoHora,
              ID_Estado = @ID_Estado,
              CargaHoraria = @CargaHoraria,
              ID_Ciclo = @ID_Ciclo,
              ID_Formacion = @ID_Formacion,
              ID_Nivel = @ID_Nivel
          WHERE ID_EspacioCurricular = @id
        `);
      res.json({ mensaje: 'Espacio curricular actualizado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar espacio curricular' });
    }
  };
  
  const deleteEspacio = async (req, res) => {
    const { id } = req.params;
    try {
      const pool = await poolPromise;
      await pool.request()
        .input('id', sql.Int, id)
        .query('DELETE FROM ESPACIOSCURRICULARES WHERE ID_EspacioCurricular = @id');
      res.json({ mensaje: 'Espacio curricular eliminado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar espacio curricular' });
    }
  };
  module.exports = {
    getEspacios,
    getEspacioPorId,
    getEspaciosDetallado,
    createEspacio,
    updateEspacio,
    deleteEspacio
  };  
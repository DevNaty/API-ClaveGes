const { poolPromise } = require('../db');
const sql = require('mssql');

const getAsignaciones = async (req, res) => {
    try {
      const pool = await poolPromise;
      const result = await pool.request().query(`
        SELECT 
          a.ID_Asignacion,
          u.Nombre + ' ' + u.Apellido AS Usuario,
          ec.Descripcion AS EspacioCurricular,
          a.AñoLectivo,
          FORMAT(a.FechaAsignacion, 'yyyy-MM-dd') AS FechaAsignacion,
          c.Descripcion AS Ciclo,
          f.Descripcion AS Formacion,
          n.Descripcion AS Nivel
        FROM ASIGNACIONES_DOCENTES a
        LEFT JOIN USUARIOS u ON a.ID_Usuario = u.ID_Usuario
        LEFT JOIN ESPACIOSCURRICULARES ec ON a.ID_EspacioCurricular = ec.ID_EspacioCurricular
        LEFT JOIN CICLOS c ON a.ID_Ciclo = c.ID_Ciclo
        LEFT JOIN FORMACIONES f ON a.ID_Formacion = f.ID_Formacion
        LEFT JOIN NIVELES n ON a.ID_Nivel = n.ID_Nivel
      `);
      res.json(result.recordset);
    } catch (error) {
      console.error('❌ Error al obtener asignaciones:', error);
      res.status(500).json({ error: 'Error al obtener asignaciones' });
    }
  };
  const getAsignacionById = async (req, res) => {
    try {
      const { ID_Asignacion } = req.params;
  
      const pool = await poolPromise;
      const result = await pool.request()
        .input('ID_Asignacion', ID_Asignacion)
        .query(`
          SELECT 
            a.*,
            u.Nombre + ' ' + u.Apellido AS NombreUsuario,
            ec.Descripcion AS EspacioCurricular,
            ci.Descripcion AS Ciclo,
            f.Descripcion AS Formacion,
            n.Descripcion AS Nivel
          FROM ASIGNACIONES_DOCENTES a
          LEFT JOIN USUARIOS u ON a.ID_Usuario = u.ID_Usuario
          LEFT JOIN ESPACIOSCURRICULARES ec ON a.ID_EspacioCurricular = ec.ID_EspacioCurricular
          LEFT JOIN CICLOS ci ON a.ID_Ciclo = ci.ID_Ciclos
          LEFT JOIN FORMACIONES f ON a.ID_Formacion = f.ID_Formacion
          LEFT JOIN NIVELES n ON a.ID_Nivel = n.ID_Nivel
          WHERE a.ID_Asignacion = @ID_Asignacion
        `);
  
      if (result.recordset.length === 0) {
        return res.status(404).json({ message: 'Asignación no encontrada' });
      }
  
      res.json(result.recordset[0]);
    } catch (error) {
      console.error('❌ Error al obtener la asignación:', error);
      res.status(500).json({ error: 'Error al obtener la asignación' });
    }
  };
  
  const createAsignacion = async (req, res) => {
    try {
      const {
        ID_Usuario,
        ID_EspacioCurricular,
        AñoLectivo,
        FechaAsignacion,
        ID_Ciclo,
        ID_Formacion,
        ID_Nivel
      } = req.body;
  
      const pool = await poolPromise;
      await pool.request()
        .input('ID_Usuario', ID_Usuario)
        .input('ID_EspacioCurricular', ID_EspacioCurricular)
        .input('AñoLectivo', AñoLectivo)
        .input('FechaAsignacion', FechaAsignacion)
        .input('ID_Ciclo', ID_Ciclo)
        .input('ID_Formacion', ID_Formacion)
        .input('ID_Nivel', ID_Nivel)
        .query(`
          INSERT INTO ASIGNACIONES_DOCENTES 
            (ID_Usuario, ID_EspacioCurricular, AñoLectivo, FechaAsignacion, ID_Ciclo, ID_Formacion, ID_Nivel)
          VALUES 
            (@ID_Usuario, @ID_EspacioCurricular, @AñoLectivo, @FechaAsignacion, @ID_Ciclo, @ID_Formacion, @ID_Nivel)
        `);
  
      res.status(201).json({ message: 'Asignación creada con éxito' });
    } catch (error) {
      console.error('❌ Error al crear asignación:', error);
      res.status(500).json({ error: 'Error al crear asignación' });
    }
  };
  const updateAsignacion = async (req, res) => {
    try {
      const { ID_Asignacion } = req.params;
      const {
        ID_Usuario,
        ID_EspacioCurricular,
        AñoLectivo,
        FechaAsignacion,
        ID_Ciclo,
        ID_Formacion,
        ID_Nivel
      } = req.body;
  
      const pool = await poolPromise;
      await pool.request()
        .input('ID_Asignacion', ID_Asignacion)
        .input('ID_Usuario', ID_Usuario)
        .input('ID_EspacioCurricular', ID_EspacioCurricular)
        .input('AñoLectivo', AñoLectivo)
        .input('FechaAsignacion', FechaAsignacion)
        .input('ID_Ciclo', ID_Ciclo)
        .input('ID_Formacion', ID_Formacion)
        .input('ID_Nivel', ID_Nivel)
        .query(`
          UPDATE ASIGNACIONES_DOCENTES
          SET 
            ID_Usuario = @ID_Usuario,
            ID_EspacioCurricular = @ID_EspacioCurricular,
            AñoLectivo = @AñoLectivo,
            FechaAsignacion = @FechaAsignacion,
            ID_Ciclo = @ID_Ciclo,
            ID_Formacion = @ID_Formacion,
            ID_Nivel = @ID_Nivel
          WHERE ID_Asignacion = @ID_Asignacion
        `);
  
      res.json({ message: 'Asignación actualizada correctamente' });
    } catch (error) {
      console.error('❌ Error al actualizar asignación:', error);
      res.status(500).json({ error: 'Error al actualizar asignación' });
    }
  };
  const deleteAsignacion = async (req, res) => {
    try {
      const { ID_Asignacion } = req.params;
  
      const pool = await poolPromise;
      await pool.request()
        .input('ID_Asignacion', ID_Asignacion)
        .query('DELETE FROM ASIGNACIONES_DOCENTES WHERE ID_Asignacion = @ID_Asignacion');
  
      res.json({ message: 'Asignación eliminada correctamente' });
    } catch (error) {
      console.error('❌ Error al eliminar asignación:', error);
      res.status(500).json({ error: 'Error al eliminar asignación' });
    }
  };

  module.exports = {
    getAsignaciones,
    getAsignacionById,
    createAsignacion,
    updateAsignacion,
    deleteAsignacion
  };  
const { poolPromise } = require('../db');
const sql = require('mssql');
const getPermisos = async (req, res) => {
    try {
      const pool = await poolPromise;
      const result = await pool.request().query(`
        SELECT 
          p.ID_Permiso,
          p.ID_Categoria,
          c.Descripcion AS Categoria,
          p.Accion
        FROM PERMISOS p
        JOIN CATEGORIAS c ON p.ID_Categoria = c.ID_Categoria
      `);
  
      res.json(result.recordset);
    } catch (error) {
      console.error('❌ Error al obtener permisos:', error);
      res.status(500).json({ error: 'Error al obtener permisos' });
    }
  };
  const getPermisoById = async (req, res) => {
    const { id } = req.params;
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query(`
          SELECT 
            p.ID_Permiso,
            p.ID_Categoria,
            c.Descripcion AS Categoria,
            p.Accion
          FROM PERMISOS p
          JOIN CATEGORIAS c ON p.ID_Categoria = c.ID_Categoria
          WHERE p.ID_Permiso = @id
        `);
  
      if (result.recordset.length === 0) {
        return res.status(404).json({ error: 'Permiso no encontrado' });
      }
  
      res.json(result.recordset[0]);
    } catch (error) {
      console.error('❌ Error al obtener permiso:', error);
      res.status(500).json({ error: 'Error al obtener permiso' });
    }
  };
  const createPermiso = async (req, res) => {
    const { ID_Categoria, Accion } = req.body;
    try {
      const pool = await poolPromise;
      await pool.request()
        .input('ID_Categoria', sql.Int, ID_Categoria)
        .input('Accion', sql.VarChar, Accion)
        .query(`
          INSERT INTO PERMISOS (ID_Categoria, Accion)
          VALUES (@ID_Categoria, @Accion)
        `);
      res.status(201).json({ message: 'Permiso creado correctamente' });
    } catch (error) {
      console.error('❌ Error al crear permiso:', error);
      res.status(500).json({ error: 'Error al crear permiso' });
    }
  };
  const updatePermiso = async (req, res) => {
    const { id } = req.params;
    const { ID_Categoria, Accion } = req.body;
    try {
      const pool = await poolPromise;
      await pool.request()
        .input('id', sql.Int, id)
        .input('ID_Categoria', sql.Int, ID_Categoria)
        .input('Accion', sql.VarChar, Accion)
        .query(`
          UPDATE PERMISOS
          SET ID_Categoria = @ID_Categoria, Accion = @Accion
          WHERE ID_Permiso = @id
        `);
      res.json({ message: 'Permiso actualizado correctamente' });
    } catch (error) {
      console.error('❌ Error al actualizar permiso:', error);
      res.status(500).json({ error: 'Error al actualizar permiso' });
    }
  };
  const deletePermiso = async (req, res) => {
    const { id } = req.params;
    try {
      const pool = await poolPromise;
      await pool.request()
        .input('id', sql.Int, id)
        .query('DELETE FROM PERMISOS WHERE ID_Permiso = @id');
  
      res.json({ message: 'Permiso eliminado correctamente' });
    } catch (error) {
      console.error('❌ Error al eliminar permiso:', error);
      res.status(500).json({ error: 'Error al eliminar permiso' });
    }
  };
  module.exports = {
    getPermisos,
    getPermisoById,
    createPermiso,
    updatePermiso,
    deletePermiso
  };
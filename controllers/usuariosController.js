// controllers/usuariosController.js

const usuarioService = require('../Services/usuariosService');

// GET todos los usuarios
const getUsuarios = async (req, res) => {
  try {
    const usuarios = await usuarioService.obtenerUsuarios();
    res.json(usuarios);
  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

// POST crear usuario
const createUsuario = async (req, res) => {
  try {
    const nuevoID = await usuarioService.crearUsuario(req.body);
    res.status(201).json({ mensaje: 'Usuario creado con éxito', ID_Usuario: nuevoID });
  } catch (error) {
    console.error('❌ Error al crear usuario:', error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

// GET usuario por ID
const getUsuarioPorId = async (req, res) => {
  try {
    const usuario = await usuarioService.obtenerUsuarioPorId(req.params.id);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    console.error('❌ Error al obtener usuario por ID:', error);
    res.status(500).json({ error: 'Error al obtener usuario por ID' });
  }
};
// GET usuarios por nombre o apellido
const buscarUsuarios = async (req, res) => {
  try {
    const filtro = req.query.filtro || '';
    const usuarios = await usuarioService.buscarUsuariosPorNombreOApellido(filtro);
    res.json(usuarios);
  } catch (error) {
    console.error('❌ Error al buscar usuarios:', error);
    res.status(500).json({ error: 'Error al buscar usuarios' });
  }
};

// PUT actualizar usuario
const updateUsuario = async (req, res) => {
  try {
    const actualizado = await usuarioService.actualizarUsuario(req.params.id, req.body);
    if (actualizado === 0) return res.status(404).json({ mensaje: 'Usuario no encontrado para actualizar' });
    res.json({ mensaje: 'Usuario actualizado con éxito' });
  } catch (error) {
    console.error('❌ Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

// DELETE eliminar usuario
const deleteUsuario = async (req, res) => {
  try {
    const eliminado = await usuarioService.eliminarUsuario(req.params.id);
    if (eliminado === 0) return res.status(404).json({ mensaje: 'Usuario no encontrado para eliminar' });
    res.json({ mensaje: 'Usuario eliminado con éxito' });
  } catch (error) {
    console.error('❌ Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};

module.exports = {
  getUsuarios,
  createUsuario,
  getUsuarioPorId,
  updateUsuario,
  buscarUsuarios,
  deleteUsuario
};






















/* controllers/usuariosController.js
const { poolPromise } = require('../db');
const bcrypt = require('bcryptjs');
const sql = require('mssql');

// 🔍 GET - Todos los usuarios
const getUsuarios = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT 
        u.*,
        c.Descripcion AS Categoria,
        ci.Descripcion AS Ciclo,
        f.Descripcion AS Formacion,
        n.Descripcion AS Nivel,
        e.Descripcion AS Estado
      FROM USUARIOS u
      LEFT JOIN USUARIOS_CATEGORIAS uc ON u.ID_Usuario = uc.ID_Usuario
      LEFT JOIN CATEGORIAS c ON uc.ID_Categoria = c.ID_Categoria
      LEFT JOIN CICLOS ci ON u.ID_Ciclo = ci.ID_Ciclo
      LEFT JOIN FORMACIONES f ON u.ID_Formacion = f.ID_Formacion
      LEFT JOIN NIVELES n ON u.ID_Nivel = n.ID_Nivel
      LEFT JOIN ESTADOS e ON u.ID_Estado = e.ID_Estado
    `);

    res.json(result.recordset);
  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

// ➕ POST - Crear nuevo usuario
const createUsuario = async (req, res) => {
  try {
    const {
      Nombre,
      Apellido,
      Telefono,
      Email,
      Password,
      Dni,
      ID_Estado,
      ID_Ciclo,
      ID_Formacion,
      ID_Nivel,
      Categorias = []
    } = req.body;

    const salt = await bcrypt.genSalt(10);
    const passwordEncriptada = await bcrypt.hash(Password, salt);

    const pool = await poolPromise;

    const result = await pool.request()
      .input('Nombre', sql.VarChar, Nombre)
      .input('Apellido', sql.VarChar, Apellido)
      .input('Telefono', sql.VarChar, Telefono)
      .input('Email', sql.VarChar, Email)
      .input('Password', sql.VarChar, passwordEncriptada)
      .input('Dni', sql.VarChar, Dni)
      .input('ID_Estado', sql.Int, ID_Estado)
      .input('ID_Ciclo', sql.Int, ID_Ciclo)
      .input('ID_Formacion', sql.Int, ID_Formacion)
      .input('ID_Nivel', sql.Int, ID_Nivel)
      .query(`
        INSERT INTO USUARIOS 
        (Nombre, Apellido, Telefono, Email, Password, Dni, ID_Estado, ID_Ciclo, ID_Formacion, ID_Nivel)
        OUTPUT INSERTED.ID_Usuario
        VALUES (@Nombre, @Apellido, @Telefono, @Email, @Password, @Dni, @ID_Estado, @ID_Ciclo, @ID_Formacion, @ID_Nivel)
      `);

    const nuevoID = result.recordset[0].ID_Usuario;

    for (let idCategoria of Categorias) {
      await pool.request()
        .input('ID_Usuario', sql.Int, nuevoID)
        .input('ID_Categoria', sql.Int, idCategoria)
        .query(`
          INSERT INTO USUARIOS_CATEGORIAS (ID_Usuario, ID_Categoria)
          VALUES (@ID_Usuario, @ID_Categoria)
        `);
    }

    res.status(201).json({ mensaje: 'Usuario creado con éxito', ID_Usuario: nuevoID });
  } catch (error) {
    console.error('❌ Error al crear usuario:', error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};



// ✏️ PUT - Actualizar un usuario por ID
const updateUsuario = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      Nombre,
      Apellido,
      Telefono,
      Email,
      Password,
      Dni,
      ID_Estado,
      ID_Ciclo,
      ID_Formacion,
      ID_Nivel,
      Categorias = []
    } = req.body;

    const pool = await poolPromise;

    const passwordFinal = Password
      ? await bcrypt.hash(Password, await bcrypt.genSalt(10))
      : null;

    const request = pool.request()
      .input('ID_USUARIO', sql.Int, id)
      .input('Nombre', sql.VarChar, Nombre)
      .input('Apellido', sql.VarChar, Apellido)
      .input('Telefono', sql.VarChar, Telefono)
      .input('Email', sql.VarChar, Email)
      .input('Dni', sql.VarChar, Dni)
      .input('ID_Estado', sql.Int, ID_Estado)
      .input('ID_Ciclo', sql.Int, ID_Ciclo)
      .input('ID_Formacion', sql.Int, ID_Formacion)
      .input('ID_Nivel', sql.Int, ID_Nivel);

    if (passwordFinal) {
      request.input('Password', sql.VarChar, passwordFinal);
    }

    const query = `
      UPDATE USUARIOS
      SET Nombre = @Nombre,
          Apellido = @Apellido,
          Telefono = @Telefono,
          Email = @Email,
          ${passwordFinal ? 'Password = @Password,' : ''}
          Dni = @Dni,
          ID_Estado = @ID_Estado,
          ID_Ciclo = @ID_Ciclo,
          ID_Formacion = @ID_Formacion,
          ID_Nivel = @ID_Nivel
      WHERE ID_USUARIO = @ID_USUARIO
    `;

    const result = await request.query(query);

    if (Categorias.length > 0) {
      await pool.request()
        .input('ID_Usuario', sql.Int, id)
        .query('DELETE FROM USUARIOS_CATEGORIAS WHERE ID_Usuario = @ID_Usuario');

      for (let idCategoria of Categorias) {
        await pool.request()
          .input('ID_Usuario', sql.Int, id)
          .input('ID_Categoria', sql.Int, idCategoria)
          .query(`
            INSERT INTO USUARIOS_CATEGORIAS (ID_Usuario, ID_Categoria)
            VALUES (@ID_Usuario, @ID_Categoria)
          `);
      }
    }

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado para actualizar' });
    }

    res.json({ mensaje: 'Usuario actualizado con éxito' });
  } catch (error) {
    console.error('❌ Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

// 🔍 GET - Usuario por ID
const getUsuarioPorId = async (req, res) => {
  try {
    const id = req.params.id;
    const pool = await poolPromise;

    const result = await pool.request()
      .input('ID_USUARIO', sql.Int, id)
      .query(`
        SELECT 
          U.ID_USUARIO,
          U.Nombre,
          U.Apellido,
          U.Telefono,
          U.Email,
          U.Password,
          U.Dni,
          U.ID_Estado,
          U.ID_Ciclo,
          U.ID_Formacion,
          U.ID_Nivel
        FROM USUARIOS U
        WHERE U.ID_USUARIO = @ID_USUARIO
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('❌ Error al obtener usuario por ID:', error);
    res.status(500).json({ error: 'Error al obtener usuario por ID' });
  }
};

// 🗑️ DELETE - Eliminar un usuario por ID
const deleteUsuario = async (req, res) => {
  try {
    const id = req.params.id;
    const pool = await poolPromise;

    // Elimina primero las relaciones con categorías si existen
    await pool.request()
      .input('ID_Usuario', sql.Int, id)
      .query('DELETE FROM USUARIOS_CATEGORIAS WHERE ID_Usuario = @ID_Usuario');

    const result = await pool.request()
      .input('ID_USUARIO', sql.Int, id)
      .query('DELETE FROM USUARIOS WHERE ID_USUARIO = @ID_USUARIO');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado para eliminar' });
    }

    res.json({ mensaje: 'Usuario eliminado con éxito' });
  } catch (error) {
    console.error('❌ Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};

module.exports = {
  getUsuarios,
  createUsuario,
  getUsuarioPorId,
  updateUsuario,
  deleteUsuario
};
*/

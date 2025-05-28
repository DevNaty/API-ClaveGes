// services/usuariosService.js
const { poolPromise } = require('../db');
const bcrypt = require('bcryptjs');
const sql = require('mssql');

// Obtener todos los usuarios
const obtenerUsuarios = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT 
      u.*,
      c.Descripcion AS Categoria,
      e.Descripcion AS Estado
    FROM USUARIOS u
    LEFT JOIN USUARIOS_CATEGORIAS uc ON u.ID_Usuario = uc.ID_Usuario
    LEFT JOIN CATEGORIAS c ON uc.ID_Categoria = c.ID_Categoria
    LEFT JOIN ESTADOS e ON u.ID_Estado = e.ID_Estado
  `);
  return result.recordset;
};

// Crear un nuevo usuario
const crearUsuario = async (datosUsuario) => {
  const {
    Nombre, Apellido, Telefono, Email, Password,
    Dni, ID_Estado, 
  } = datosUsuario;

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
    .query(`
      INSERT INTO USUARIOS 
      (Nombre, Apellido, Telefono, Email, Password, Dni, ID_Estado)
      OUTPUT INSERTED.ID_Usuario
      VALUES (@Nombre, @Apellido, @Telefono, @Email, @Password, @Dni, @ID_Estado)
    `);


  const nuevoID = result.recordset[0].ID_Usuario;
/*
  for (let idCategoria of Categorias) {
    await pool.request()
      .input('ID_Usuario', sql.Int, nuevoID)
      .input('ID_Categoria', sql.Int, idCategoria)
      .query(`INSERT INTO USUARIOS_CATEGORIAS (ID_Usuario, ID_Categoria) VALUES (@ID_Usuario, @ID_Categoria)`);
  }*/

  return nuevoID;
};

// Obtener usuario por ID
const obtenerUsuarioPorId = async (id) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('ID_USUARIO', sql.Int, id)
    .query(`
      SELECT * FROM USUARIOS WHERE ID_USUARIO = @ID_USUARIO
    `);
  return result.recordset[0];
};

// Actualizar usuario
const actualizarUsuario = async (id, datos) => {
  const {
    Nombre, Apellido, Telefono, Email, Password,
    Dni, ID_Estado
  } = datos;

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
    .input('ID_Estado', sql.Int, ID_Estado);

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
        ID_Estado = @ID_Estado
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
        .query(`INSERT INTO USUARIOS_CATEGORIAS (ID_Usuario, ID_Categoria) VALUES (@ID_Usuario, @ID_Categoria)`);
    }
  }

  return result.rowsAffected[0];
};

// Eliminar usuario
const eliminarUsuario = async (id) => {
  const pool = await poolPromise;

  await pool.request()
    .input('ID_Usuario', sql.Int, id)
    .query('DELETE FROM USUARIOS_CATEGORIAS WHERE ID_Usuario = @ID_Usuario');

  const result = await pool.request()
    .input('ID_USUARIO', sql.Int, id)
    .query('DELETE FROM USUARIOS WHERE ID_USUARIO = @ID_USUARIO');

  return result.rowsAffected[0];
};

module.exports = {
  obtenerUsuarios,
  crearUsuario,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario
};

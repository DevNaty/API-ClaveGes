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
  return result.recordset;
};

// Crear un nuevo usuario
const crearUsuario = async (datosUsuario) => {
  const {
    Nombre, Apellido, Telefono, Email, Password,
    Dni, ID_Estado, ID_Ciclo, ID_Formacion, ID_Nivel, Categorias
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
      .query(`INSERT INTO USUARIOS_CATEGORIAS (ID_Usuario, ID_Categoria) VALUES (@ID_Usuario, @ID_Categoria)`);
  }

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
    Dni, ID_Estado, ID_Ciclo, ID_Formacion, ID_Nivel, Categorias
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

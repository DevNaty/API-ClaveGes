const sql = require('mssql');
const { poolPromise } = require('../db');

// Obtener todos los usuarios
const obtenerUsuarios = async () => {
  // Aquí hay un posible error: 'pool' no está definido en este ámbito.
  // Debería ser 'poolPromise' y luego obtener la conexión.
  const pool = await poolPromise; // Asegurarse de obtener el pool
  const result = await pool.request().query('SELECT * FROM Usuarios');
  return result.recordset; // Para mssql, los resultados están en recordset
};

// Crear usuario
const crearUsuario = async (usuarioData) => {
  const { nombre, apellido, mail, password, telefono, fecha_nacimiento, dni } = usuarioData;
  const pool = await poolPromise;
  const result = await pool.request()
    .input('nombre', sql.VarChar, nombre)
    .input('apellido', sql.VarChar, apellido)
    .input('mail', sql.VarChar, mail)
    .input('password', sql.VarChar, password)
    .input('telefono', sql.VarChar, telefono)
    .input('fecha_nacimiento', sql.Date, fecha_nacimiento) // Asumiendo que es una fecha
    .input('dni', sql.VarChar, dni)
    .query(
      'INSERT INTO Usuarios (NOMBRE, APELLIDO, MAIL, PASSWORD, TELEFONO, FECHA_NACIMIENTO, DNI) VALUES (@nombre, @apellido, @mail, @password, @telefono, @fecha_nacimiento, @dni)'
    );
  // Para mssql, el ID insertado se puede obtener de diferentes maneras,
  // por ejemplo, usando SCOPE_IDENTITY() en la consulta o si la tabla tiene una columna IDENTITY
  // y la librería lo soporta directamente (a menudo result.insertId no existe en mssql como en mysql)
  // Para un caso simple, puedes hacer un SELECT SCOPE_IDENTITY() después de la inserción.
  // Por ahora, solo retornamos un indicador de éxito.
  return result.rowsAffected[0] > 0;
};
// Obtener por ID
const obtenerUsuarioPorId = async (id) => {
  const pool = await poolPromise;
  const request = pool.request();

  // Consulta principal para obtener los datos del usuario
  const userResult = await request
    .input('id', sql.Int, id)
    .query('SELECT ID_Usuario, NOMBRE, APELLIDO, DNI, ID_Estado FROM Usuarios WHERE ID_USUARIO = @id'); // Asegúrate de listar las columnas que quieres, excluyendo PASSWORD si no es necesaria

  const user = userResult.recordset[0];

  if (!user) {
    return null; // Si el usuario no existe, retorna null
  }

  // Ahora, obtenemos las categorías asignadas a este usuario
  const categoriesRequest = pool.request(); // Usar un nuevo request para la segunda consulta
  const assignedCategoriesResult = await categoriesRequest
    .input('userId', sql.Int, id)
    .query(`
      SELECT C.ID_Categoria, C.Descripcion
      FROM CATEGORIAS C
      JOIN USUARIOS_CATEGORIAS UC ON C.ID_Categoria = UC.ID_Categoria
      WHERE UC.ID_Usuario = @userId
    `);

  // Agrega las categorías asignadas al objeto del usuario
  user.Categorias = assignedCategoriesResult.recordset;

  return user;
};



// Buscar por nombre o apellido
const buscarUsuariosPorNombreOApellido = async (filtro) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('filtro', sql.VarChar, `%${filtro}%`)
    .query(`
      SELECT
        u.*,
        c.Descripcion AS Categoria,
        e.Descripcion AS Estado
      FROM USUARIOS u
      LEFT JOIN USUARIOS_CATEGORIAS uc ON u.ID_Usuario = uc.ID_Usuario
      LEFT JOIN CATEGORIAS c ON uc.ID_Categoria = c.ID_Categoria
      LEFT JOIN ESTADOS e ON u.ID_Estado = e.ID_Estado
      WHERE u.Nombre LIKE @filtro OR u.Apellido LIKE @filtro
    `);
  return result.recordset;
};

// Asignar categorías
const asignarCategoriasAUsuario = async (ID_Usuario, Categorias) => {
  const pool = await poolPromise;
  const categoriasArray = Array.isArray(Categorias) ? Categorias : [];

  const transaction = new sql.Transaction(pool);
  try {
    await transaction.begin();
    const request = new sql.Request(transaction);

    // 2. Insertar las nuevas categorías secuencialmente
    if (categoriasArray.length > 0) {
      // Usamos un bucle for...of para ejecutar las promesas en secuencia
      for (const idCat of categoriasArray) {
        // Importante: Puedes reutilizar el 'request' si no hay conflictos de nombres de parámetros
        // o crear uno nuevo si lo prefieres para claridad, pero asegurándote de que se resuelva antes del siguiente.
        // Aquí re-creo para mayor seguridad con nombres de input únicos.
        const insertRequest = new sql.Request(transaction);
        await insertRequest.input('ID_Usuario_ins', sql.Int, ID_Usuario)
                           .input('ID_Categoria_ins', sql.Int, idCat)
                           .query('INSERT INTO USUARIOS_CATEGORIAS (ID_USUARIO, ID_CATEGORIA) VALUES (@ID_Usuario_ins, @ID_Categoria_ins)');
      }
    }
    await transaction.commit();
    return { ok: true, cantidad: categoriasArray.length };
  } catch (err) {
    console.error('Error al asignar categorías en el servicio (antes de rollback):', err);
    // Intentar el rollback SOLO SI LA TRANSACCION ESTA ACTIVA
    // Esto es un intento de mitigar, pero el problema es el 'request in progress'
    // La verdadera solución es evitar que haya requests en progreso cuando se intenta el rollback.
    // El for...of debería ayudar a que los requests terminen antes del error.
    if (transaction.isStarted) { // Check if transaction is still active
        try {
            await transaction.rollback();
            console.log('Transacción revertida con éxito.');
        } catch (rollbackErr) {
            console.error('Error al revertir la transacción:', rollbackErr);
        }
    }
    throw err; // Re-lanzar el error para que el controlador lo capture
  }
};

// Eliminar categoría
const eliminarCategoriaDeUsuario = async (idUsuario, idCategoria) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('idUsuario', sql.Int, idUsuario)
    .input('idCategoria', sql.Int, idCategoria)
    .query('DELETE FROM USUARIOS_CATEGORIAS WHERE ID_USUARIO = @idUsuario AND ID_CATEGORIA = @idCategoria');
  return result.rowsAffected[0] > 0; // true si se eliminó una fila
};

// Actualizar usuario
const actualizarUsuario = async (id, data) => {
  const pool = await poolPromise;
  const request = pool.request();
  let updateQuery = 'UPDATE Usuarios SET ';
  const params = [];
  const setParts = [];

  for (const key in data) {
    // Evitar la inyección de SQL. No concatenar directamente los valores.
    // Usar inputs para cada campo.
    setParts.push(`${key} = @${key}`);
    request.input(key, data[key]); // mssql infiere el tipo o puedes especificarlo
  }
  updateQuery += setParts.join(', ') + ' WHERE ID_USUARIO = @id';
  request.input('id', sql.Int, id);

  const result = await request.query(updateQuery);
  return result.rowsAffected[0] > 0;
};

// Eliminar usuario
const eliminarUsuario = async (id) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query('DELETE FROM Usuarios WHERE ID_USUARIO = @id');
  return result.rowsAffected[0] > 0;
};

module.exports = {
  obtenerUsuarios,
  crearUsuario,
  obtenerUsuarioPorId,
  buscarUsuariosPorNombreOApellido,
  asignarCategoriasAUsuario,
  eliminarCategoriaDeUsuario,
  actualizarUsuario,
  eliminarUsuario
};
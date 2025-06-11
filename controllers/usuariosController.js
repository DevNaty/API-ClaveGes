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
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'El ID debe ser un número válido' });
  }

  try {
    const usuario = await usuarioService.obtenerUsuarioPorId(id);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
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

// POST asignar categorías
const asignarCategoriasAUsuario = async (req, res) => {
  const { ID_Usuario, Categorias } = req.body;

  try {
    const resultado = await usuarioService.asignarCategoriasAUsuario(ID_Usuario, Categorias);
    res.json({ mensaje: 'Categorías asignadas correctamente.', resultado });
  } catch (error) {
    console.error('❌ Error al asignar categorías:', error);
    res.status(500).json({ error: 'Error interno al asignar categorías.' });
  }
};

// DELETE eliminar categoría de usuario
const eliminarCategoriaDeUsuario = async (req, res) => {
  const { idUsuario, idCategoria } = req.params;

  try {
    const resultado = await usuarioService.eliminarCategoriaDeUsuario(idUsuario, idCategoria);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ msg: 'No se encontró la asignación para eliminar.' });
    }

    res.json({ msg: 'Categoría eliminada correctamente del usuario.' });
  } catch (error) {
    console.error('❌ Error al eliminar la categoría del usuario:', error);
    res.status(500).json({ msg: 'Error al eliminar la categoría del usuario.' });
  }
};

// PUT actualizar usuario
const updateUsuario = async (req, res) => {
  try {
    const actualizado = await usuarioService.actualizarUsuario(req.params.id, req.body);
    if (!actualizado) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado para actualizar' });
    }
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
    if (!eliminado) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado para eliminar' });
    }
    res.json({ mensaje: 'Usuario eliminado con éxito' });
  } catch (error) {
    console.error('❌ Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};

// Exportar todas las funciones
module.exports = {
  getUsuarios,
  createUsuario,
  getUsuarioPorId,
  buscarUsuarios,
  asignarCategoriasAUsuario,
  eliminarCategoriaDeUsuario,
  updateUsuario,
  deleteUsuario,
};

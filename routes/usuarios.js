const express = require('express');
const routes = express.Router();
const { validationResult } = require('express-validator');

// Validadores y middlewares
const validarUsuario = require('../validator/usuarioValidator');
const { validarUsuarioPut } = require('../middlewares/validarUsuario');
const { validarCampos } = require('../middlewares/validarCampos');
const validarJWT = require('../middlewares/validarJWT');

// Controladores
const {
  getUsuarios,
  createUsuario,
  getUsuarioPorId,
  buscarUsuarios,
  asignarCategoriasAUsuario,
  eliminarCategoriaDeUsuario,
  updateUsuario,
  deleteUsuario
} = require('../controllers/usuariosController');

// ✅ Ruta de prueba
routes.get('/test', (req, res) => {
  res.send('✅ Ruta de prueba funcionando!');
});

// 🔒 Ruta protegida con JWT
routes.get('/protegida', validarJWT, (req, res) => {
  res.json({
    msg: 'Accediste a una ruta protegida',
    usuario: req.usuario
  });
});

// 🟢 GET - Obtener todos los usuarios
routes.get('/', getUsuarios);

// 🔍 GET - Buscar usuarios por query o ID
routes.get('/buscar', buscarUsuarios); // Ejemplo: /buscar?nombre=Juan
routes.get('/:id', getUsuarioPorId);
routes.delete('/:idUsuario/categorias/:idCategoria', eliminarCategoriaDeUsuario);


// ➕ POST - Crear un nuevo usuario (con validación)
routes.post(
  '/',
  validarUsuario,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }
    next();
  },
  createUsuario
);

// 📥 POST - Asignar categorías a un usuario
routes.post('/asignar-categorias', asignarCategoriasAUsuario);

// ✏️ PUT - Actualizar un usuario (con validación)
routes.put('/:id', validarUsuarioPut, validarCampos, updateUsuario);

// 🗑️ DELETE - Eliminar un usuario por ID
routes.delete('/:id', deleteUsuario);

module.exports = routes;

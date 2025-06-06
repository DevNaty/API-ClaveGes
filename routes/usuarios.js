const express = require('express');
const routes = express.Router();
const validarUsuario = require('../validator/usuarioValidator'); 
const { validationResult } = require('express-validator'); 
const { validarUsuarioPut } = require('../middlewares/validarUsuario');
const { validarCampos } = require('../middlewares/validarCampos');
const validarJWT = require('../middlewares/validarJWT');

const {
  getUsuarios,
  createUsuario,
  getUsuarioPorId,
  buscarUsuarios,
  updateUsuario,
  deleteUsuario
} = require('../controllers/usuariosController');

// ✅ Ruta de prueba
routes.get('/test', (req, res) => {
  res.send('✅ Ruta de prueba funcionando!');
});
// Esta ruta solo se puede acceder con token válido
routes.get('/protegida', validarJWT, (req, res) => {
  res.json({
    msg: 'Accediste a una ruta protegida',
    usuario: req.usuario // El payload del token
  });
});
// 🟢 GET - Todos los usuarios
routes.get('/', getUsuarios);

// 🔍 GET - Usuario por ID
routes.get('/:id', getUsuarioPorId);
routes.get('/buscar',buscarUsuarios);

// ➕ POST - Crear nuevo 
// ✨ Ruta con validación incluida
routes.post('/', validarUsuario, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Devuelve errores de validación
    return res.status(400).json({ errores: errors.array() });
  }
  next(); // Si no hay errores, continúa al controller
}, createUsuario);




// ✏️ PUT - Actualizar un usuario por ID
routes.put('/:id', validarUsuarioPut, validarCampos, updateUsuario);
// 🗑️ DELETE - Eliminar un usuario por ID
routes.delete('/:id', deleteUsuario);



module.exports = routes;

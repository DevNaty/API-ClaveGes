const express = require('express');
const router = express.Router();
const permisosController = require('../controllers/permisosController');

// Rutas
router.get('/', permisosController.getPermisos);
router.get('/:id', permisosController.getPermisoById);
router.post('/', permisosController.createPermiso);
router.put('/:id', permisosController.updatePermiso);
router.delete('/:id', permisosController.deletePermiso);

module.exports = router;

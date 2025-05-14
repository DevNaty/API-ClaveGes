const express = require('express');
const router = express.Router();
const localidadesController = require('../controllers/localidadesController');

// Rutas
router.get('/', localidadesController.getLocalidades);
router.get('/:id', localidadesController.getLocalidadById);
router.post('/', localidadesController.createLocalidad);
router.put('/:id', localidadesController.updateLocalidad);
router.delete('/:id', localidadesController.deleteLocalidad);

module.exports = router;
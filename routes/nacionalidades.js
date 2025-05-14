const express = require('express');
const router = express.Router();
const nacionalidadesController = require('../controllers/nacionalidadesController');

// Rutas
router.get('/', nacionalidadesController.getNacionalidades);
router.get('/:id', nacionalidadesController.getNacionalidadById);
router.post('/', nacionalidadesController.createNacionalidad);
router.put('/:id', nacionalidadesController.updateNacionalidad);
router.delete('/:id', nacionalidadesController.deleteNacionalidad);

module.exports = router;
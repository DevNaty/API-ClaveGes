const express = require('express');
const router = express.Router();
const estadosController = require('../controllers/estadosController');

// Rutas
router.get('/', estadosController.getEstado);
router.get('/:id', estadosController.getEstadoById);
router.post('/', estadosController.createEstado);
router.put('/:id', estadosController.updateEstado);
router.delete('/:id', estadosController.deleteEstado);

module.exports = router;

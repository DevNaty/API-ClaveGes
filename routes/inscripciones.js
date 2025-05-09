const express = require('express');
const router = express.Router();
const inscripcionesController = require('../controllers/inscripcionesController');

// Rutas
router.get('/', inscripcionesController.getInscripciones);
router.get('/:id', inscripcionesController.getInscripcionById);
router.post('/', inscripcionesController.createInscripcion);
router.put('/:id', inscripcionesController.updateInscripcion);
router.delete('/:id', inscripcionesController.deleteInscripcion);

module.exports = router;

const express = require('express');
const router = express.Router();
const inscripcionesController = require('../controllers/inscripcionesController');

// Rutas
router.post('/', inscripcionesController.crearInscripcion);
router.get('/:id', inscripcionesController.obtenerInscripcionPorId);
router.get('/', inscripcionesController.obtenerInscripciones);
//router.put('/:id', inscripcionesController.);
router.delete('/:id', inscripcionesController.eliminarInscripcion);

module.exports = router;
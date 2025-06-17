const express = require('express');
const router = express.Router();
const datosInscripcionesController = require('../controllers/datosInscripcionesController');

// Rutas
router.post('/', datosInscripcionesController.crearInscripcion);
router.get('/:id', datosInscripcionesController.obtenerInscripcionPorId);
router.put('/:id', datosInscripcionesController.actualizarInscripcion);
router.get('/', datosInscripcionesController.obtenerInscripciones);
router.delete('/:id', datosInscripcionesController.eliminarInscripcion);

module.exports = router;
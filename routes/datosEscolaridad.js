const express = require('express');
const router = express.Router();
const datosEscolaridadController = require('../controllers/datosEscolaridadController');

router.post('/', datosEscolaridadController.crearDatosEscolaridad);
router.get('/', datosEscolaridadController.obtenerDatosEscolaridad);
router.get('/:id', datosEscolaridadController.obtenerDatosEscolaridadPorId);
router.put('/:id', datosEscolaridadController.actualizarDatosEscolaridad);
router.delete('/:id', datosEscolaridadController.eliminarDatosEscolaridad);

module.exports = router;

const express = require('express');
const router = express.Router();
const datosAlumnosController = require('../controllers/datosAlumnosController');

router.post('/', datosAlumnosController.crearDatosAlumno);
router.get('/:id', datosAlumnosController.obtenerDatosAlumnoPorId);
router.put('/:id', datosAlumnosController.actualizarDatosAlumno);
router.delete('/:id', datosAlumnosController.eliminarDatosAlumno);

module.exports = router;

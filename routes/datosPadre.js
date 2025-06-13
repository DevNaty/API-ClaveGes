const express = require('express');
const router = express.Router();
const datosPadreController = require('../controllers/datosPadreController');

router.post('/', datosPadreController.crearDatosPadre);
router.get('/', datosPadreController.obtenerDatosPadre);
router.get('/:id', datosPadreController.obtenerDatosPadrePorId);
router.put('/:id', datosPadreController.actualizarDatosPadre);
router.delete('/:id', datosPadreController.eliminarDatosPadre);

module.exports = router;

const express = require('express');
const router = express.Router();
const datosTutorController = require('../controllers/datosTutorController');

router.post('/', datosTutorController.crearDatosTutor);
router.get('/', datosTutorController.obtenerDatosTutor);
router.get('/:id', datosTutorController.obtenerDatosTutorPorId);
router.put('/:id', datosTutorController.actualizarDatosTutor);
router.delete('/:id', datosTutorController.eliminarDatosTutor);

module.exports = router;
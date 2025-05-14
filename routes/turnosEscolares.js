const express = require('express');
const router = express.Router();
const turnosEscolaresController = require('../controllers/turnosEscolaresController');

// Rutas
router.get('/', turnosEscolaresController.getTurnos);
router.get('/:id', turnosEscolaresController.getTurnoById);
router.post('/', turnosEscolaresController.createTurno);
router.put('/:id', turnosEscolaresController.updateTurno);
router.delete('/:id', turnosEscolaresController.deleteTurno);

module.exports = router;
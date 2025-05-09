const express = require('express');
const router = express.Router();
const cargaHorariaController = require('../controllers/cargaHorariaController');

// Rutas
router.get('/', cargaHorariaController.getCargaHoraria);
router.get('/:id', cargaHorariaController.getCargaHorariaById);
router.post('/', cargaHorariaController.createCargaHoraria);
router.put('/:id', cargaHorariaController.updateCargaHoraria);
router.delete('/:id', cargaHorariaController.deleteCargaHoraria);

module.exports = router;

const express = require('express');
const router = express.Router();
const ocupacionesVinculosController = require('../controllers/ocupacionesVinculosController');

router.post('/', ocupacionesVinculosController.crearOcupacionVinculo);
router.get('/', ocupacionesVinculosController.obtenerTodos);
router.get('/:id', ocupacionesVinculosController.obtenerPorId);
router.put('/:id', ocupacionesVinculosController.actualizarOcupacionVinculo);
router.delete('/:id', ocupacionesVinculosController.eliminarOcupacionVinculo);

module.exports = router;

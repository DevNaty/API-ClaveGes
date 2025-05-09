const express = require('express');
const router = express.Router();
const espaciosCurricularesController = require('../controllers/espaciosCurricularesController');

// Rutas
router.get('/', espaciosCurricularesController.getEspacios);
router.get('/:id', espaciosCurricularesController.getEspacioPorId);
router.get('/:id', espaciosCurricularesController.getEspaciosDetallado);
router.post('/', espaciosCurricularesController.createEspacio);
router.put('/:id', espaciosCurricularesController.updateEspacio);
router.delete('/:id', espaciosCurricularesController.deleteEspacio);

module.exports = router;

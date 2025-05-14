const express = require('express');
const router = express.Router();
const vinculosController = require('../controllers/vinculosController');

// Rutas
router.get('/', vinculosController.getVinculos);
router.get('/:id', vinculosController.getVinculoById);
router.post('/', vinculosController.createVinculo);
router.put('/:id', vinculosController.updateVinculo);
router.delete('/:id', vinculosController.deleteVinculo);

module.exports = router;
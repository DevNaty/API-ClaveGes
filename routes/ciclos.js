const express = require('express');
const router = express.Router();
const ciclosController = require('../controllers/ciclosController');

// Rutas
router.get('/', ciclosController.getCiclo);
router.get('/:id', ciclosController.getCicloById);
router.post('/', ciclosController.createCiclo);
router.put('/:id', ciclosController.updateCiclo);
router.delete('/:id', ciclosController.deleteCiclo);

module.exports = router;

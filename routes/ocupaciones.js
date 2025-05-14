const express = require('express');
const router = express.Router();
const ocupacionesController = require('../controllers/ocupacionesController');

// Rutas
router.get('/', ocupacionesController.getOcupaciones);
router.get('/:id', ocupacionesController.getOcupacionById);
router.post('/', ocupacionesController.createOcupacion);
router.put('/:id', ocupacionesController.updateOcupacion);
router.delete('/:id', ocupacionesController.deleteOcupacion);

module.exports = router;
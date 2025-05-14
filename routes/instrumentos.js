const express = require('express');
const router = express.Router();
const instrumentosController = require('../controllers/instrumentosController');

// Rutas
router.get('/', instrumentosController.getInstrumentos);
router.get('/:id', instrumentosController.getInstrumentoById);
router.post('/', instrumentosController.createInstrumento);
router.put('/:id', instrumentosController.updateInstrumento);
router.delete('/:id', instrumentosController.deleteInstrumento);

module.exports = router;
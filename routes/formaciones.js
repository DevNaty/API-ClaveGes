
const express = require('express');
const router = express.Router();
const formacionesController = require('../controllers/formacionesController');

// Rutas
router.get('/', formacionesController.getFormacion);
router.get('/:id', formacionesController.getFormacionById);
router.post('/', formacionesController.createFormacion);
router.put('/:id', formacionesController.updateFormacion);
router.delete('/:id', formacionesController.deleteFormacion);

module.exports = router;



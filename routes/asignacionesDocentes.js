const express = require('express');
const router = express.Router();
const asignacionesDocentesController = require('../controllers/asignacionesDocentesController');

// Rutas
router.get('/', asignacionesDocentesController.getAsignaciones);
router.get('/:id', asignacionesDocentesController.getAsignacionById);
router.post('/', asignacionesDocentesController.createAsignacion);
router.put('/:id', asignacionesDocentesController.updateAsignacion);
router.delete('/:id', asignacionesDocentesController.deleteAsignacion);

module.exports = router;

const express = require('express');
const router = express.Router();
const tiposDeHorasController = require('../controllers/tiposDeHorasController');

// Rutas
router.get('/', tiposDeHorasController.getTipoHora);
router.get('/:id', tiposDeHorasController.getTipoHoraById);
router.post('/', tiposDeHorasController.createTipoHora);
router.put('/:id', tiposDeHorasController.updateTipoHora);
router.delete('/:id', tiposDeHorasController.deleteTipoHora);

module.exports = router;
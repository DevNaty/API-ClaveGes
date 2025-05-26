const express = require('express');
const router = express.Router();
const instrumentosDetallesController = require('../controllers/instrumentosDetallesController');

router.post('/', instrumentosDetallesController.crearInstrumentoDet);
router.get('/', instrumentosDetallesController.obtenerInstrumentoDetTodos);
router.get('/:id', instrumentosDetallesController.obtenerInstrumentoDetPorId);
router.put('/:id', instrumentosDetallesController.actualizarInstrumentoDet);
router.delete('/:id', instrumentosDetallesController.eliminarInstrumentoDet);

module.exports = router;

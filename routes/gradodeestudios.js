const express = require('express');
const router = express.Router();
const gradodeestudiosController = require('../controllers/gradodeestudiosController');

// Rutas
router.get('/', gradodeestudiosController.getGradoEstudioObtenido);
router.get('/:id', gradodeestudiosController.getGradoEstudioObtenidoByID);
router.post('/', gradodeestudiosController.createGradoEstudioObtenido);
router.put('/:id', gradodeestudiosController.updateGradoEstudioObtenido);
router.delete('/:id', gradodeestudiosController.deleteGradoEstudioObtenido);

module.exports = router;
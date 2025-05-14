const express = require('express');
const router = express.Router();
const gradosescolaresController = require('../controllers/gradosescolaresController');

// Rutas
router.get('/', gradosescolaresController.getGradosEscolares);
router.get('/:id', gradosescolaresController.getGradoEscolarByID);
router.post('/', gradosescolaresController.createGradoEscolar);
router.put('/:id', gradosescolaresController.updateGradoEscolar);
router.delete('/:id', gradosescolaresController.deleteGradoEscolar);

module.exports = router;
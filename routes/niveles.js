const express = require('express');
const router = express.Router();
const nivelesController = require('../controllers/nivelesController');

// Rutas
router.get('/', nivelesController.getNivel);
router.get('/:id', nivelesController.getNivelById);
router.post('/', nivelesController.createNivel);
router.put('/:id', nivelesController.updateNivel);
router.delete('/:id', nivelesController.deleteNivel);

module.exports = router;
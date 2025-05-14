const express = require('express');
const router = express.Router();
const nivelesAcademicosController = require('../controllers/nivelesAcademicosController');

// Rutas
router.get('/', nivelesAcademicosController.getNivelesEscolares);
router.get('/:id', nivelesAcademicosController.getNivelEscolarById);
router.post('/', nivelesAcademicosController.createNivelEscolar);
router.put('/:id', nivelesAcademicosController.updateNivelEscolar);
router.delete('/:id', nivelesAcademicosController.deleteNivelEscolar);

module.exports = router;
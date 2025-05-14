const express = require('express');
const router = express.Router();
const escuelasController = require('../controllers/escuelasController');

// Rutas
router.get('/', escuelasController.getEscuelas);
router.get('/:id', escuelasController.getEscuelaById);
router.post('/', escuelasController.createEscuela);
router.put('/:id', escuelasController.updateEscuela);
router.delete('/:id', escuelasController.deleteEscuela);

module.exports = router;
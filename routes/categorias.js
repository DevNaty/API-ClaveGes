const express = require('express');
const router = express.Router();
const categoriasController = require('../controllers/categoriasController');

// Rutas
router.get('/', categoriasController.getCategorias);
router.get('/:id', categoriasController.getCategoriaById);
router.post('/', categoriasController.createCategoria);
router.put('/:id', categoriasController.updateCategoria);
router.delete('/:id', categoriasController.deleteCategoria);

module.exports = router;

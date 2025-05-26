const express = require('express');
const router = express.Router();
const matriculaDetController = require('../controllers/matriculaDetController');

router.post('/', matriculaDetController.crearMatriculaDet);
router.get('/', matriculaDetController.obtenerMatriculaDetTodos);
router.get('/:id', matriculaDetController.obtenerMatriculaDetPorId);
router.put('/:id', matriculaDetController.actualizarMatriculaDet);
router.delete('/:id', matriculaDetController.eliminarMatriculaDet);

module.exports = router;

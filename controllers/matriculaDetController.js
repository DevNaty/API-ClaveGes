const matriculaDetService = require('../Services/matriculaDetService');

const crearMatriculaDet = async (req, res) => {
  try {
    const datos = req.body;
    const nuevoId = await matriculaDetService.crearMatriculaDet(datos);
    res.status(201).json({ ID_DetalleMatricula: nuevoId });
  } catch (error) {
    console.error('Error al crear Detalle de Matricula:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const obtenerMatriculaDetTodos = async (req, res) => {
  try {
    const lista = await matriculaDetService.obtenerMatriculaDetTodos();
    res.status(200).json(lista);
  } catch (error) {
    console.error('Error al obtener Detalle de Matricula:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const obtenerMatriculaDetPorId = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const item = await matriculaDetService.obtenerMatriculaDetPorId(id);
    res.status(200).json(item);
  } catch (error) {
    console.error('Error al obtener Detalle de Matricula por ID:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
const actualizarMatriculaDet = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const datos = req.body;
    await matriculaDetService.actualizarMatriculaDet(id, datos);
    res.status(200).json({ mensaje: 'Detalle de Matricula actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar Detalle de Matricula:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


const eliminarMatriculaDet = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await matriculaDetService.eliminarMatriculaDet(id);
    res.status(200).json({ mensaje: 'Detalle de Matricula eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar Detalle de Matricula:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  crearMatriculaDet,
  obtenerMatriculaDetTodos,
  obtenerMatriculaDetPorId,
  actualizarMatriculaDet,
  eliminarMatriculaDet

};

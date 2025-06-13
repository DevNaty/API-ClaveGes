const datosTutorService = require('../Services/datosTutorService');

const crearDatosTutor = async (req, res) => {
  try {
    const datos = req.body;
    const resultado = await datosTutorService.crearDatosTutor(datos);
    res.status(201).json(resultado);
  } catch (error) {
    console.error('Error al crear datos del tutor:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const obtenerDatosTutor = async (req, res) => {
  try {
    const datos = await datosTutorService.obtenerDatosTutor();
    res.json(datos);
  } catch (error) {
    console.error('❌ Error al obtener datos del tutor:', error);
    res.status(500).json({ error: 'Error al obtener datos del tutor' });
  }
};

const obtenerDatosTutorPorId = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const resultado = await datosTutorService.obtenerDatosTutorPorId(id);
    res.status(200).json(resultado);
  } catch (error) {
    console.error('Error al obtener datos del tutor:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const actualizarDatosTutor = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const datos = req.body;
    await datosTutorService.actualizarDatosTutor(id, datos);
    res.status(200).json({ mensaje: 'Datos del tutor actualizados' });
  } catch (error) {
    console.error('Error al actualizar datos del tutor:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const eliminarDatosTutor = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await datosTutorService.eliminarDatosTutor(id);
    res.status(200).json({ mensaje: 'Datos del tutor eliminados' });
  } catch (error) {
    console.error('Error al eliminar datos del tutor:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  crearDatosTutor,
  obtenerDatosTutor,
  obtenerDatosTutorPorId,
  actualizarDatosTutor,
  eliminarDatosTutor
};

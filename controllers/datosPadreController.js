const datosPadreService = require('../Services/datosPadreService');

const crearDatosPadre = async (req, res) => {
  try {
    const datos = req.body;
    const resultado = await datosPadreService.crearDatosPadre(datos);
    res.status(201).json(resultado);
  } catch (error) {
    console.error('Error al crear datos del padre:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const obtenerDatosPadre = async (req, res) => {
  try {
    const datos = await datosPadreService.obtenerDatosPadre();
    res.json(datos);
  } catch (error) {
    console.error('❌ Error al obtener datos padre:', error);
    res.status(500).json({ error: 'Error al obtener datos padre' });
  }
};
const obtenerDatosPadrePorId = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const resultado = await datosPadreService.obtenerDatosPadrePorId(id);
    res.status(200).json(resultado);
  } catch (error) {
    console.error('Error al obtener datos del padre:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const actualizarDatosPadre = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const datos = req.body;
    await datosPadreService.actualizarDatosPadre(id, datos);
    res.status(200).json({ mensaje: 'Datos del padre actualizados' });
  } catch (error) {
    console.error('Error al actualizar datos del padre:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const eliminarDatosPadre = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await datosPadreService.eliminarDatosPadre(id);
    res.status(200).json({ mensaje: 'Datos del padre eliminados' });
  } catch (error) {
    console.error('Error al eliminar datos del padre:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  crearDatosPadre,
  obtenerDatosPadre,
  obtenerDatosPadrePorId,
  actualizarDatosPadre,
  eliminarDatosPadre
};

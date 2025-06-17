const datosInscripcionesService = require('../Services/datos-InscripcionesService');

const crearInscripcion = async (req, res) => {
  try {
    const nuevaInscripcion = await datosInscripcionesService.crearInscripcion(req.body);
    res.status(201).json({
      mensaje: 'Inscripción creada correctamente',
      ID_DatoInscripcion: nuevaInscripcion.ID_DatoInscripcion
    });
  } catch (error) {
    console.error('❌ Error al crear inscripción:', error);
    res.status(500).json({ error: 'Error al crear inscripción' });
  }
};

const obtenerInscripciones = async (req, res) => {
  try {
    const inscripciones = await datosInscripcionesService.obtenerInscripciones();
    res.json(inscripciones);
  } catch (error) {
    console.error('❌ Error al obtener inscripciones:', error);
    res.status(500).json({ error: 'Error al obtener inscripciones' });
  }
};

const obtenerInscripcionPorId = async (req, res) => {
  try {
    const id = req.params.id;
    const inscripcion = await datosInscripcionesService.obtenerInscripcionPorId(id);
    if (!inscripcion) {
      return res.status(404).json({ mensaje: 'Inscripción no encontrada' });
    }
    res.json(inscripcion);
  } catch (error) {
    console.error('❌ Error al obtener inscripción:', error);
    res.status(500).json({ error: 'Error al obtener inscripción' });
  }
};

const actualizarInscripcion = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const datos = req.body;
    await datosInscripcionesService.actualizarInscripcion(id, datos);
    res.status(200).json({ mensaje: 'Datos del alumno actualizados' });
  } catch (error) {
    console.error('Error al actualizar datos del alumno:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const eliminarInscripcion = async (req, res) => {
  try {
    const id = req.params.id;
    const eliminado = await datosInscripcionesService.eliminarInscripcion(id);
    if (!eliminado) {
      return res.status(404).json({ mensaje: 'Inscripción no encontrada para eliminar' });
    }
    res.json({ mensaje: 'Inscripción eliminada correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar inscripción:', error);
    res.status(500).json({ error: 'Error al eliminar inscripción' });
  }
};

const obtenerInscripcionesConDescripciones = async (req, res) => {
  try {
    const nuevaInscripcion = await datosInscripcionesService.obtenerInscripcionesConDescripciones(req.body);
    res.status(201).json({
      mensaje: 'Inscripción creada correctamente',
      ID_DatoInscripcion: nuevaInscripcion.ID_DatoInscripcion
    });
  } catch (error) {
    console.error('❌ Error al crear inscripción:', error);
    res.status(500).json({ error: 'Error al crear inscripción' });
  }
};

module.exports = {
  crearInscripcion,
  obtenerInscripciones,
  obtenerInscripcionPorId,
  actualizarInscripcion,
  eliminarInscripcion,
  obtenerInscripcionesConDescripciones
};

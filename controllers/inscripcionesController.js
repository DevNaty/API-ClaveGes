const inscripcionesService = require('../Services/inscripcionesService');

const crearInscripcion = async (req, res) => {
  try {
    const nuevaInscripcion = await inscripcionesService.crearInscripcion(req.body);
    res.status(201).json({
      mensaje: 'Inscripción creada correctamente',
      ID_Inscripcion: nuevaInscripcion.ID_Inscripcion
    });
  } catch (error) {
    console.error('❌ Error al crear inscripción:', error);
    res.status(500).json({ error: 'Error al crear inscripción' });
  }
};

const obtenerInscripciones = async (req, res) => {
  try {
    const inscripciones = await inscripcionesService.obtenerInscripciones();
    res.json(inscripciones);
  } catch (error) {
    console.error('❌ Error al obtener inscripciones:', error);
    res.status(500).json({ error: 'Error al obtener inscripciones' });
  }
};

const obtenerInscripcionPorId = async (req, res) => {
  try {
    const id = req.params.id;
    const inscripcion = await inscripcionesService.obtenerInscripcionPorId(id);
    if (!inscripcion) {
      return res.status(404).json({ mensaje: 'Inscripción no encontrada' });
    }
    res.json(inscripcion);
  } catch (error) {
    console.error('❌ Error al obtener inscripción:', error);
    res.status(500).json({ error: 'Error al obtener inscripción' });
  }
};

const eliminarInscripcion = async (req, res) => {
  try {
    const id = req.params.id;
    const eliminado = await inscripcionesService.eliminarInscripcion(id);
    if (!eliminado) {
      return res.status(404).json({ mensaje: 'Inscripción no encontrada para eliminar' });
    }
    res.json({ mensaje: 'Inscripción eliminada correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar inscripción:', error);
    res.status(500).json({ error: 'Error al eliminar inscripción' });
  }
};

module.exports = {
  crearInscripcion,
  obtenerInscripciones,
  obtenerInscripcionPorId,
  eliminarInscripcion
};

const { poolPromise } = require('../db');
const sql = require('mssql');

const getInscripciones = async (req, res) => {
    try {
      const pool = await poolPromise;
      const result = await pool.request().query(`
        SELECT 
          i.ID_Inscripcion,
          u.Nombre + ' ' + u.Apellido AS Usuario,
          ci.Descripcion AS Ciclo,
          f.Descripcion AS Formacion,
          n.Descripcion AS Nivel,
          ec.Descripcion AS EspacioCurricular,
          i.AñoLectivo,
          i.FechaInscripcion,
          e.ID_Estado AS Estado,
          i.FechaNacimiento,
          i.LugarNacimiento,
          na.ID_Nacionalidad AS Nacionalidad,		
          l.ID_Localidad AS Localidad,
          c.ID_Calle AS Calle,
          i.Numero,
          i.Telefono1,
          i.Telefono1_pertenece,
          i.Telefono2,
          i.Telefono2_pertenece,
          i.Email_comunicacion,
          dm.ID_DatosMama AS Datos_Madre,
          dp.ID_DatosPapa AS Datos_Padre,
          dt.ID_DatosTutor AS Datos_Tutor,
          es.ID_Escuela AS Escuela,
          nva.ID_NivelEscolar AS Nivel_Academico,
          ge.ID_Grado AS Grado,
          t.ID_Turno AS Turno,
          md.ID_DetalleMatricula AS Matricula,
          id.ID_DetalleInstrumento AS Instrumento,
          i.TieneInstrumento,
          gde.ID_GradoEstudioObtenido AS Grado_Estudio,
          o.ID_Ocupacion AS Ocupacion       


        FROM INSCRIPCIONES i
        INNER JOIN USUARIOS u ON i.ID_Usuario = u.ID_Usuario
        INNER JOIN CICLOS ci ON i.ID_Ciclo = ci.ID_Ciclo
        INNER JOIN FORMACIONES f ON i.ID_Formacion = f.ID_Formacion
        INNER JOIN NIVELES n ON i.ID_Nivel = n.ID_Nivel
        INNER JOIN ESPACIOSCURRICULARES ec ON i.ID_EspacioCurricular = ec.ID_EspacioCurricular
        INNER JOIN ESTADOS e ON i.ID_Estado = e.ID_Estado
        INNER JOIN NACIONALIDADES na ON i.ID_Nacionalidad = na.ID_Nacionalidad
        INNER JOIN LOCALIDADES l ON i.ID_Localidad = l.ID_Localidad
        INNER JOIN CALLES c ON i.ID_Calle = c.ID_Calle
        INNER JOIN DATOS_MAMA dm ON i.ID_DatosMama	= dm.ID_DatosMama	
        INNER JOIN DATOS_PAPA dp ON i.ID_DatosPapa	= dp.ID_DatosPapa	
        INNER JOIN DATOS_TUTOR dt ON i.ID_DatosTutor	= dt.ID_DatosTutor	
        INNER JOIN ESCUELAS es ON i.ID_Escuela	= es.ID_Escuela	
        INNER JOIN NIVELES_ACADEMICOS nva ON i.ID_NivelEscolar	= nva.ID_NivelEscolar
        INNER JOIN GRADOS_ESCOLARES ge ON i.ID_Grado	= ge.ID_Grado	
        INNER JOIN TURNOS_ESCOLARES t ON  i.ID_Turno	= t.ID_Turno
        INNER JOIN MATRICULAS_DETALLES md ON i.ID_DetalleMatricula	= md.ID_DetalleMatricula	
        INNER JOIN INSTRUMENTOS_DETALLES id ON i.ID_DetalleInstrumento	 = id.ID_DetalleInstrumento	
        INNER JOIN GRADO_DE_ESTUDIOS gde ON i.ID_GradoEstudioObtenido	= gde.ID_GradoEstudioObtenido	
        INNER JOIN OCUPACIONES o ON i.ID_Ocupacion	= o.ID_Ocupacion	
      
        `);
  
      res.json(result.recordset);
    } catch (error) {
      console.error('❌ Error al obtener inscripciones:', error);
      res.status(500).json({ error: 'Error al obtener inscripciones' });
    }
  };
  const getInscripcionById = async (req, res) => {
    try {
      const { id } = req.params;
      const pool = await poolPromise;
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query(`
          SELECT 
            i.ID_Inscripcion,
            u.Nombre + ' ' + u.Apellido AS Usuario,
            ci.Descripcion AS Ciclo,
            f.Descripcion AS Formacion,
            n.Descripcion AS Nivel,
            ec.Descripcion AS EspacioCurricular,
            i.AñoLectivo,
            i.FechaInscripcion,
            i.ID_Estado
          FROM INSCRIPCIONES i
          INNER JOIN USUARIOS u ON i.ID_Usuario = u.ID_Usuario
          INNER JOIN CICLOS ci ON i.ID_Ciclo = ci.ID_Ciclo
          INNER JOIN FORMACIONES f ON i.ID_Formacion = f.ID_Formacion
          INNER JOIN NIVELES n ON i.ID_Nivel = n.ID_Nivel
          INNER JOIN ESPACIOSCURRICULARES ec ON i.ID_EspacioCurricular = ec.ID_EspacioCurricular
          WHERE i.ID_Inscripcion = @id
        `);
  
      if (result.recordset.length === 0) {
        return res.status(404).json({ message: 'Inscripción no encontrada' });
      }
  
      res.json(result.recordset[0]);
    } catch (error) {
      console.error('❌ Error al obtener inscripción por ID:', error);
      res.status(500).json({ error: 'Error al obtener inscripción' });
    }
  };
 
  const createInscripcion = async (req, res) => {
    try {
      const pool = await poolPromise;
  
      const {
        // Datos personales e inscripción
        ID_Usuario, ID_Ciclo, ID_Formacion, ID_Nivel, ID_EspacioCurricular, AñoLectivo,
        FechaInscripcion, ID_Estado, FechaNacimiento, LugarNacimiento, ID_Nacionalidad,
        ID_Localidad, ID_Calle, Numero, Telefono1, Telefono1_pertenece, Telefono2,
        Telefono2_pertenece, Email_comunicacion, ID_Escuela, ID_NivelEscolar, ID_Grado,
        ID_Turno, TieneInstrumento, ID_GradoEstudioObtenido, ID_Ocupacion,
        Instrumento, // Instrumento elegido
        DatosMama, DatosPapa, DatosTutor
      } = req.body;
  
      // 👉 Insertar en MATRICULAS_DETALLES
      const matriculaDetallesResult = await pool.request()
        .input('ID_Instrumento', Instrumento)
        .query(`
          INSERT INTO MATRICULAS_DETALLES (ID_Instrumento)
          OUTPUT INSERTED.ID_DetalleMatricula
          VALUES (@ID_Instrumento)
        `);
  
      const ID_DetalleMatricula = matriculaDetallesResult.recordset[0].ID_DetalleMatricula;
  
      // 👉 Insertar en INSTRUMENTOS_DETALLES (opcional según tu modelo)
      const instrumentoDetallesResult = await pool.request()
        .input('ID_Instrumento', Instrumento)
        .query(`
          INSERT INTO INSTRUMENTOS_DETALLES (ID_Instrumento)
          OUTPUT INSERTED.ID_DetalleInstrumento
          VALUES (@ID_Instrumento)
        `);
  
      const ID_DetalleInstrumento = instrumentoDetallesResult.recordset[0].ID_DetalleInstrumento;
  
      // 👉 Insertar DATOS_MAMA
      const mamaResult = await pool.request()
        .input('Nombre', DatosMama.Nombre)
        .input('Apellido', DatosMama.Apellido)
        .input('DNI', DatosMama.DNI)
        .query(`
          INSERT INTO DATOS_MAMA (Nombre, Apellido, DNI)
          OUTPUT INSERTED.ID_DatosMama
          VALUES (@Nombre, @Apellido, @DNI)
        `);
      const ID_DatosMama = mamaResult.recordset[0].ID_DatosMama;
  
      // 👉 Insertar DATOS_PAPA
      const papaResult = await pool.request()
        .input('Nombre', DatosPapa.Nombre)
        .input('Apellido', DatosPapa.Apellido)
        .input('DNI', DatosPapa.DNI)
        .query(`
          INSERT INTO DATOS_PAPA (Nombre, Apellido, DNI)
          OUTPUT INSERTED.ID_DatosPapa
          VALUES (@Nombre, @Apellido, @DNI)
        `);
      const ID_DatosPapa = papaResult.recordset[0].ID_DatosPapa;
  
      // 👉 Insertar DATOS_TUTOR
      const tutorResult = await pool.request()
        .input('Nombre', DatosTutor.Nombre)
        .input('Apellido', DatosTutor.Apellido)
        .input('DNI', DatosTutor.DNI)
        .query(`
          INSERT INTO DATOS_TUTOR (Nombre, Apellido, DNI)
          OUTPUT INSERTED.ID_DatosTutor
          VALUES (@Nombre, @Apellido, @DNI)
        `);
      const ID_DatosTutor = tutorResult.recordset[0].ID_DatosTutor;
  
      // 👉 Insertar INSCRIPCIÓN
      const inscripcionResult = await pool.request()
        .input('ID_Usuario', ID_Usuario)
        .input('ID_Ciclo', ID_Ciclo)
        .input('ID_Formacion', ID_Formacion)
        .input('ID_Nivel', ID_Nivel)
        .input('ID_EspacioCurricular', ID_EspacioCurricular)
        .input('AñoLectivo', AñoLectivo)
        .input('FechaInscripcion', FechaInscripcion)
        .input('ID_Estado', ID_Estado)
        .input('FechaNacimiento', FechaNacimiento)
        .input('LugarNacimiento', LugarNacimiento)
        .input('ID_Nacionalidad', ID_Nacionalidad)
        .input('ID_Localidad', ID_Localidad)
        .input('ID_Calle', ID_Calle)
        .input('Numero', Numero)
        .input('Telefono1', Telefono1)
        .input('Telefono1_pertenece', Telefono1_pertenece)
        .input('Telefono2', Telefono2)
        .input('Telefono2_pertenece', Telefono2_pertenece)
        .input('Email_comunicacion', Email_comunicacion)
        .input('ID_DatosMama', ID_DatosMama)
        .input('ID_DatosPapa', ID_DatosPapa)
        .input('ID_DatosTutor', ID_DatosTutor)
        .input('ID_Escuela', ID_Escuela)
        .input('ID_NivelEscolar', ID_NivelEscolar)
        .input('ID_Grado', ID_Grado)
        .input('ID_Turno', ID_Turno)
        .input('ID_DetalleMatricula', ID_DetalleMatricula)
        .input('ID_DetalleInstrumento', ID_DetalleInstrumento)
        .input('TieneInstrumento', TieneInstrumento)
        .input('ID_GradoEstudioObtenido', ID_GradoEstudioObtenido)
        .input('ID_Ocupacion', ID_Ocupacion)
        .query(`
          INSERT INTO INSCRIPCIONES (
            ID_Usuario, ID_Ciclo, ID_Formacion, ID_Nivel, ID_EspacioCurricular, AñoLectivo,
            FechaInscripcion, ID_Estado, FechaNacimiento, LugarNacimiento,
            ID_Nacionalidad, ID_Localidad, ID_Calle, Numero,
            Telefono1, Telefono1_pertenece, Telefono2, Telefono2_pertenece, Email_comunicacion,
            ID_DatosMama, ID_DatosPapa, ID_DatosTutor, ID_Escuela, ID_NivelEscolar,
            ID_Grado, ID_Turno, ID_DetalleMatricula, ID_DetalleInstrumento,
            TieneInstrumento, ID_GradoEstudioObtenido, ID_Ocupacion
          )
          OUTPUT INSERTED.ID_Inscripcion
          VALUES (
            @ID_Usuario, @ID_Ciclo, @ID_Formacion, @ID_Nivel, @ID_EspacioCurricular, @AñoLectivo,
            @FechaInscripcion, @ID_Estado, @FechaNacimiento, @LugarNacimiento,
            @ID_Nacionalidad, @ID_Localidad, @ID_Calle, @Numero,
            @Telefono1, @Telefono1_pertenece, @Telefono2, @Telefono2_pertenece, @Email_comunicacion,
            @ID_DatosMama, @ID_DatosPapa, @ID_DatosTutor, @ID_Escuela, @ID_NivelEscolar,
            @ID_Grado, @ID_Turno, @ID_DetalleMatricula, @ID_DetalleInstrumento,
            @TieneInstrumento, @ID_GradoEstudioObtenido, @ID_Ocupacion
          )
        `);
  
      const ID_Inscripcion = inscripcionResult.recordset[0].ID_Inscripcion;
  
      res.status(201).json({
        message: '✅ Inscripción creada correctamente.',
        ID_Inscripcion
      });
  
    } catch (error) {
      console.error('❌ Error al crear inscripción:', error);
      res.status(500).json({ error: 'Error al crear inscripción' });
    }
  };
  
  
  const updateInscripcion = async (req, res) => {
    try {
      const { id } = req.params;
      const {
        ID_Usuario,
        ID_Ciclo,
        ID_Formacion,
        ID_Nivel,
        ID_EspacioCurricular,
        AñoLectivo,
        FechaInscripcion,
        ID_Estado
      } = req.body;
  
      const pool = await poolPromise;
      await pool.request()
        .input('ID', sql.Int, id)
        .input('ID_Usuario', sql.Int, ID_Usuario)
        .input('ID_Ciclo', sql.Int, ID_Ciclo)
        .input('ID_Formacion', sql.Int, ID_Formacion)
        .input('ID_Nivel', sql.Int, ID_Nivel)
        .input('ID_EspacioCurricular', sql.Int, ID_EspacioCurricular)
        .input('AñoLectivo', sql.Int, AñoLectivo)
        .input('FechaInscripcion', sql.DateTime, FechaInscripcion)
        .input('ID_Estado', sql.Int, ID_Estado)
        .query(`
          UPDATE INSCRIPCIONES SET
            ID_Usuario = @ID_Usuario,
            ID_Ciclo = @ID_Ciclo,
            ID_Formacion = @ID_Formacion,
            ID_Nivel = @ID_Nivel,
            ID_EspacioCurricular = @ID_EspacioCurricular,
            AñoLectivo = @AñoLectivo,
            FechaInscripcion = @FechaInscripcion,
            ID_Estado = @ID_Estado
          WHERE ID_Inscripcion = @ID
        `);
  
      res.json({ message: 'Inscripción actualizada exitosamente' });
    } catch (error) {
      console.error('❌ Error al actualizar inscripción:', error);
      res.status(500).json({ error: 'Error al actualizar inscripción' });
    }
  };
  const deleteInscripcion = async (req, res) => {
    try {
      const { id } = req.params;
      const pool = await poolPromise;
      await pool.request()
        .input('ID', sql.Int, id)
        .query('DELETE FROM INSCRIPCIONES WHERE ID_Inscripcion = @ID');
  
      res.json({ message: 'Inscripción eliminada exitosamente' });
    } catch (error) {
      console.error('❌ Error al eliminar inscripción:', error);
      res.status(500).json({ error: 'Error al eliminar inscripción' });
    }
  };
module.exports = {
    getInscripciones,
    getInscripcionById,
    createInscripcion,
    updateInscripcion,
    deleteInscripcion
};  

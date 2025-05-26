const { sql, poolPromise } = require('../db');

async function crearInscripcion(idUsuario, datos) {
  const pool = await poolPromise;
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    const request = new sql.Request(transaction);

    let idOcupacionVinculo = datos.datosAlumno.idOcupacionVinculo;

    if (!idOcupacionVinculo) {
      // Buscar si ya existe la combinación de Vínculo + Ocupación
      const resultVinculo = await request
        .input('idVinculo', sql.Int, datos.idVinculo)
        .input('idOcupacion', sql.Int, datos.idOcupacion)
        .query(`
          SELECT ID_OcupacionVinculo FROM OCUPACIONES_VINCULOS
          WHERE ID_Vinculo = @idVinculo AND ID_Ocupacion = @idOcupacion
        `);

      if (resultVinculo.recordset.length > 0) {
        // Ya existe: usar el ID existente
        idOcupacionVinculo = resultVinculo.recordset[0].ID_OcupacionVinculo;
      } else {
        // No existe: insertar y obtener ID generado
        const insertResult = await request
          .input('idVinculo', sql.Int, datos.idVinculo)
          .input('idOcupacion', sql.Int, datos.idOcupacion)
          .query(`
            INSERT INTO OCUPACIONES_VINCULOS (ID_Vinculo, ID_Ocupacion)
            OUTPUT INSERTED.ID_OcupacionVinculo
            VALUES (@idVinculo, @idOcupacion)
          `);
        
        idOcupacionVinculo = insertResult.recordset[0].ID_OcupacionVinculo;
      }
    }
    // Paso 2: Insertar en MATRICULAS_DETALLES
    for (const matricula of datos.matricula) {
      await request
        .input('idInstrumento', sql.Int, matricula.idInstrumento)
        .query(`
          INSERT INTO MATRICULAS_DETALLES (ID_Instrumento)
          VALUES (@idInstrumento)
        `);
    }

    // Paso 3: Insertar en INSTRUMENTOS_DETALLES
    for (const instrumento of datos.instrumentos) {
      await request
        .input('idInstrumento', sql.Int, instrumento.idInstrumento)
        .query(`
          INSERT INTO INSTRUMENTOS_DETALLES (ID_Instrumento)
          VALUES (@idInstrumento)
        `);
    }

    // Paso 4: Insertar en DATOS_ALUMNOS si no existe
    const resultAlumno = await request
      .input('idUsuario', sql.VarChar, datos.datosAlumno.idUsuario)
      .query(`SELECT * FROM DATOS_ALUMNOS WHERE ID_Usuario = @idUsuario`);

    if (resultAlumno.recordset.length === 0) {
      await request
       
        .input('fechaNacimiento', sql.Date, datos.datosAlumno.fechaNacimiento)
        .input('LugarNacimiento', sql.VarChar, datos.datosAlumno.LugarNacimiento)
        .input('ID_Localidad', sql.Int, datos.datosAlumno.ID_Localidad)
        .input('ID_Calle', sql.Int, datos.datosAlumno.ID_Calle)
        .input('Numero', sql.VarChar, datos.datosAlumno.Numero)
        .input('ID_Nacionalidad', sql.Int, datos.datosAlumno.ID_Nacionalidad)
        .input('Nombre_Mama', sql.VarChar, datos.datosAlumno.Nombre_Mama)
        .input('Apellido_Mama', sql.VarChar, datos.datosAlumno.Apellido_Mama)
        .input('Dni_Mama', sql.VarChar, datos.datosAlumno.Dni_Mama)
        .input('Nombre_Papa', sql.VarChar, datos.datosAlumno.Nombre_Papa)
        .input('Apellido_Papa', sql.VarChar, datos.datosAlumno.Apellido_Papa)
        .input('Dni_Papa', sql.VarChar, datos.datosAlumno.Dni_Papa)
        .input('ID_OcupacionVinculo', sql.Int, datos.datosAlumno.ID_OcupacionVinculo)
        .query(`
          INSERT INTO DATOS_ALUMNOS (FechaNacimiento, LugarNacimiento, ID_Localidad, ID_Calle, 
          Numero, ID_Nacionalidad, Nombre_Mama, Apellido_Mama, Dni_Mama, Nombre_Papa, 
          Apellido_Papa, Dni_Papa, ID_OcupacionVinculo,
          Nombre_Tutor, Apellido_Tutor, Telefono1, Telefono2, Tel1_Pertenece, Tel2_Pertenece,EmailCominicacion, 
          ID_Escuela, ID_NivelEscolar, ID_Grado, ID_Turno, ID_DetalleMatricula, ID_DetalleInstrumento,
          TieneInstrumento, ID_GradoEstudioObtenido, ID_Ocupacion, Observaciones)
          VALUES 
          (@fechaNacimiento, @LugarNacimiento, @ID_Localidad, 
          @ID_Calle, @Numero, @ID_Nacionalidad, @Nombre_Mama, 
          @Apellido_Mama, @Dni_Mama, @Nombre_Papa, 
          @Apellido_Papa, @Dni_Papa, @ID_OcupacionVinculo,
          @Nombre_Tutor, @Apellido_Tutor, @Telefono1, @Telefono2, 
          @Tel1_Pertenece, @Tel2_Pertenece,@EmailCominicacion, 
          @ID_Escuela, @ID_NivelEscolar, @ID_Grado, @ID_Turno, 
          @ID_DetalleMatricula, @ID_DetalleInstrumento,
          @TieneInstrumento, @ID_GradoEstudioObtenido, @ID_Ocupacion, @Observaciones)
        `);
    }

    // Paso 5: Insertar en INSCRIPCIONES
    await request
      .input('idUsuario', sql.Int, datos.datosAlumno.idUsuario)
      .input('idDatosAlumno', sql.Int, datos.datosAlumno.idDatosAlumno)
      .input('idDetalleMatricula', sql.Int, datos.datosAlumno.idDetalleMatricula)
      .input('idCiclo', sql.Int, datos.inscripcion.idCiclo)
      .input('idFormacion', sql.Int, datos.inscripcion.idFormacion)
      .input('idEspacioCurricular', sql.Int, datos.inscripcion.idEspacioCurricular)
      .input('AñoLectivo', sql.Date, datos.inscripcion.AñoLectivo)
      .input('FechaInscripcion', sql.Date, datos.inscripcion.FechaInscripcion)



      .query(`
        INSERT INTO INSCRIPCIONES (DNI_ALUMNO, CICLO_LECTIVO, FECHA_INSCRIPCION, TURNO)
        VALUES (@dni, @cicloLectivo, @fechaInscripcion, @turno)
      `);

    await transaction.commit();
    return { success: true, message: 'Inscripción realizada con éxito' };

  } catch (error) {
    await transaction.rollback();
    console.error('❌ Error al crear inscripción:', error);
    throw error;
  }
}

module.exports = { crearInscripcion };

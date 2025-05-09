const express = require('express');
const router = express.Router();
const { poolPromise } = require('../db');
const sql = require('mssql');
const bcrypt = require('bcryptjs');

// 🛡️ Endpoint para encriptar contraseñas en texto plano
router.post('/encriptar-passwords', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT ID_USUARIO, Password FROM Usuarios');
    const usuarios = result.recordset;

    let actualizados = 0;
    let yaEncriptados = 0;

    for (const usuario of usuarios) {
      const { ID_USUARIO, Password } = usuario;

      const esTextoPlano = Password.length < 20 || !Password.startsWith('$2a$');
      if (esTextoPlano) {
        const salt = await bcrypt.genSalt(10);
        const passwordEncriptada = await bcrypt.hash(Password, salt);

        await pool.request()
          .input('ID_USUARIO', sql.Int, ID_USUARIO)
          .input('Password', sql.VarChar, passwordEncriptada)
          .query(`
            UPDATE Usuarios
            SET Password = @Password
            WHERE ID_USUARIO = @ID_USUARIO
          `);

        actualizados++;
      } else {
        yaEncriptados++;
      }
    }

    res.json({
      msg: 'Proceso completado',
      actualizados,
      yaEncriptados
    });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: 'Error en el proceso de encriptación' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { poolPromise } = require('../db');

// POST /api/login
router.post(
  '/',
  [
    body('Email').notEmpty().withMessage('El Email es obligatorio'),
    body('Password').notEmpty().withMessage('La contraseña es obligatoria')
  ],
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    const { Email, Password } = req.body;

    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input('Email', Email)
        .query('SELECT * FROM Usuarios WHERE Email = @Email');

      const usuario = result.recordset[0];

      if (!usuario) {
        return res.status(400).json({ msg: 'Email o contraseña incorrectos' });
      }

      const passwordValida = await bcrypt.compare(Password, usuario.Password);

      if (!passwordValida) {
        return res.status(400).json({ msg: 'Email o contraseña incorrectos' });
      }

      // Generamos el token
      const token = jwt.sign(
        {
          id: usuario.ID_USUARIO,
          nombre: usuario.Nombre,
          email: usuario.Email
        },
        process.env.JWT_SECRET || 'claveSecreta123', // En producción usar algo seguro
        { expiresIn: '2h' }
      );

      res.json({ token, usuario: { id: usuario.ID_USUARIO, nombre: usuario.Nombre } });
    } catch (err) {
      console.error('❌ Error en login:', err);
      res.status(500).json({ msg: 'Error del servidor' });
    }
  }
);

module.exports = router;

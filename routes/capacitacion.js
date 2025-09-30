const express = require('express');
const router = express.Router();
const path = require('path');
// Rutas deshabilitadas para compatibilidad con Vercel (no se permite manejo de archivos en disco)
const { isAuthenticated } = require('../middlewares/authMiddleware');

// Página de capacitación (sin archivos)
router.get('/', isAuthenticated, (req, res) => {
  res.render('capacitacion', { plantillas: [], archivosUsuario: {}, user: req.user });
});

module.exports = router;
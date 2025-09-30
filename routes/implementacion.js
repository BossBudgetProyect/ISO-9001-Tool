const express = require('express');
const router = express.Router();
// Rutas deshabilitadas para compatibilidad con Vercel (no se permite manejo de archivos en disco)
const { isAuthenticated } = require('../middlewares/authMiddleware');

// Página de implementación (sin archivos)
router.get('/', isAuthenticated, (req, res) => {
  res.render('implementacion', { plantillas: [], archivosUsuario: {}, user: req.user, path: '' });
});

module.exports = router;
const express = require('express');
const router = express.Router();

const { isAuthenticated } = require('../middlewares/authMiddleware');


// Render ISO seleccionada
router.get('/IsoSelect', isAuthenticated, (req, res) => {
  const alertData = req.session.alertData || {};
  req.session.alertData = null;
  res.render('IsoSelect', alertData);
});

// Render ISO 9001 form
router.get('/IsoForm9001', isAuthenticated, (req, res) => {
  const alertData = req.session.alertData || {};
  req.session.alertData = null;
  res.render('IsoForm9001', alertData);
});

// POST - Registrar empresa ISO (solo sesión)
router.post('/registro-iso', (req, res) => {
  // Guardar datos en sesión en vez de BD
  req.session.empresa = req.body;
  req.session.empresa_id = Date.now(); // ID simulado
  req.session.alertData = {
    alert: true,
    alertTitle: "Registro Exitoso",
    alertMessage: "La auditoría se registró correctamente (modo sesión).",
    alertIcon: 'success',
    showConfirmButton: true,
    ruta: "/IsoChecklist9001"
  };
  res.redirect('/IsoChecklist9001');
});

// POST - Guardar checklist (solo sesión)
router.post('/guardar-checklist', isAuthenticated, (req, res) => {
  const { empresa_id, resultados } = req.body;
  if (!empresa_id || !resultados || !Array.isArray(resultados)) {
    return res.status(400).json({ success: false, message: 'Datos incompletos' });
  }
  // Guardar checklist en sesión
  req.session.checklist = resultados;
  res.json({ success: true, message: 'Checklist guardado correctamente (modo sesión)' });
});

// Render checklist ISO
router.get('/IsoChecklist9001', isAuthenticated, (req, res) => {
  const alertData = req.session.alertData || {};
  req.session.alertData = null;
  res.render('IsoChecklist9001', {
    ...alertData,
    empresa_id: req.session.empresa_id || null,
    checklist: req.session.checklist || []
  });
});

module.exports = router;

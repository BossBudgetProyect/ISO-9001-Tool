function isAdmin(req, res, next) {
  if (req.session.loggedin && req.session.rol === 'admin') {
    return next(); // Tiene rol de admin, continúa
  }
  // Si no es admin, redirige o envía mensaje de error
  return res.status(403).send('Acceso denegado: solo administradores');
}

module.exports = { isAdmin };

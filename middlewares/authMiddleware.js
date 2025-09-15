// Middleware para restringir las páginas únicamente a los usuarios con cuenta creada
function isAuthenticated(req, res, next) {
    if (req.session.loggedin) {
        next();
    } else {
        res.redirect('/login');
    }
}


module.exports = { isAuthenticated };
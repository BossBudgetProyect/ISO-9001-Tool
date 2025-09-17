// Middleware para restringir las páginas únicamente a los usuarios con cuenta creada
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        req.user = req.session.user; // 🔹 Copiamos a req.user
        return next();
    } else {
        return res.redirect('/');
    }
}



module.exports = { isAuthenticated };
const express = require('express');
const router = express.Router();

// Página de login
router.get("/", function(req, res) {
    const alertData = req.session.alertData || {};
    req.session.alertData = null;
    res.render("login", alertData);
});

router.get("/login", function(req, res) {
    res.redirect('/');
});

// LOGIN simulado solo con sesión
router.post('/login', function (req, res) {
    const email = req.body.email;
    const password = req.body.password;

    if (email && password) {
        // Simulación: cualquier usuario/contraseña es válido
        req.session.loggedin = true;
        req.session.user = {
            id: Date.now(),
            email: email,
            name: email.split('@')[0]
        };
        req.session.alertData = {
            alert: true,
            alertTitle: "¡LOGIN CORRECTO!",
            alertMessage: "¡Bienvenido a la aplicación! (modo sesión)",
            alertIcon: 'success',
            showConfirmButton: true,
            ruta: ""
        };
        return res.redirect('/IsoSelect');
    } else {
        req.session.alertData = {
            alert: true,
            alertTitle: "Error",
            alertMessage: "Por favor, ingresa usuario y contraseña.",
            alertIcon: 'warning',
            showConfirmButton: true,
            ruta: ""
        };
        return res.redirect('/');
    }
});

// REGISTRO simulado solo con sesión
router.post('/register', function(req, res) {
    let nombre_completo = req.body.name;
    let email = req.body.email;
    let password = req.body.password;

    // Simulación: no se guarda nada, solo muestra mensaje
    req.session.alertData = {
        alert: true,
        alertTitle: "¡Registro exitoso!",
        alertMessage: "Por favor inicia sesión.",
        alertIcon: "success",
        showConfirmButton: true,
        ruta: ""
    };
    return res.redirect('/');
});

// LOGOUT
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

module.exports = router;

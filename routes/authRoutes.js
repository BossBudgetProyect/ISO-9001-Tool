const express = require('express');
const router = express.Router();
const db = require('../db'); // conexión sqlite3
const { isAuthenticated } = require('../middlewares/authMiddleware');
const bcrypt = require('bcrypt');

// Página de login
router.get("/", function(req, res) {
    const alertData = req.session.alertData || {};
    req.session.alertData = null;
    res.render("normasIso", alertData);
});

router.get("/normasIso", function(req, res) {
    res.redirect('/');
});

// LOGIN
router.post('/login', async function (req, res) {
    const email = req.body.email;
    const password = req.body.password;

    if (email && password) {
        // En SQLite usamos db.get porque solo esperamos una fila
        db.get('SELECT * FROM usuarios WHERE correo = ?', [email], async (err, user) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error en el servidor.");
            }

            if (!user || !(await bcrypt.compare(password, user.contrasena))) {
                req.session.alertData = {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "USUARIO y/o PASSWORD incorrectas",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    ruta: ""
                };
                return res.redirect('/');
            } else {
                req.session.loggedin = true;
                req.session.user = {
                id: user.id,
                email: user.correo,
                name: user.nombre_completo
                };

                req.session.alertData = {
                    alert: true,
                    alertTitle: "¡LOGIN CORRECTO!",
                    alertMessage: "¡Bienvenido a la aplicación!",
                    alertIcon: 'success',
                    showConfirmButton: true,
                    ruta: ""
                };

                return res.redirect('/IsoSelect');
            }
        });
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

// REGISTRO
router.post('/register', async function(req, res) {
    let nombre_completo = req.body.name;
    let email = req.body.email;
    let password = req.body.password;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        let registrar = `
            INSERT INTO usuarios (nombre_completo, correo, contrasena)
            VALUES (?, ?, ?)
        `;
        let valores = [nombre_completo, email, hashedPassword];

        db.run(registrar, valores, function(err) {
            if (err) {
                console.error("Error al registrar:", err);
                req.session.alertData = {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Error al registrar los datos.",
                    alertIcon: "error",
                    showConfirmButton: true,
                    ruta: ""
                };
                return res.redirect('/');
            } else {
                console.log("✅ Usuario registrado con ID:", this.lastID);
                req.session.alertData = {
                    alert: true,
                    alertTitle: "¡Registro exitoso!",
                    alertMessage: "Por favor inicia sesión.",
                    alertIcon: "success",
                    showConfirmButton: true,
                    ruta: ""
                };
                return res.redirect('/');
            }
        });
    } catch (err) {
        console.error("Error al procesar la solicitud:", err);
        req.session.alertData = {
            alert: true,
            alertTitle: "Error",
            alertMessage: "Ocurrió un error en el servidor.",
            alertIcon: "error",
            showConfirmButton: true,
            ruta: ""
        };
        return res.redirect('/');
    }
});

// LOGOUT
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

module.exports = router;

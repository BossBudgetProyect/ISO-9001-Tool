const express = require('express');
const router = express.Router();
const db = require('../db'); // Si necesitas usar la base de datos
const { isAuthenticated } = require('../middlewares/authMiddleware'); // Utilizamos el middleware de autenticación de sesiones
const bcrypt = require('bcrypt'); // Encriptado de contraseñas

// Rutas públicas (no requieren autenticación)
router.get("/", function(req, res) { // Ruta principal - Página de login
    const alertData = req.session.alertData || {};
    req.session.alertData = null; // Limpiar después de mostrar
    res.render("normasIso", alertData);
});

// Ruta explícita para login/register (redirige a la principal)
router.get("/normasIso", function(req, res) {
    res.redirect('/');
});

// Login - Método para la autenticación
router.post('/login', async function (req, res) {
    const email = req.body.email;  // viene de name="email"
    const password = req.body.password; // viene de name="pass"

    if (email && password) {
        db.query('SELECT * FROM usuarios WHERE correo = ?', [email], async (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).send("Error en el servidor.");
            }

            if (results.length === 0 || !(await bcrypt.compare(password, results[0].contrasena))) {
                // Guardar datos de alerta en sesión
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
                // Guardamos en la sesión los datos importantes
                req.session.loggedin = true;
                req.session.email = results[0].Correo;
                req.session.name = results[0].Nombres;

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

// Registro - método de registro
router.post('/register', async function(req, res) {
	
	let nombre_completo = req.body.name;
	let email = req.body.email;
	let password = req.body.password;
	
	try {
		// Hashear la contraseña
		const hashedPassword = await bcrypt.hash(password, 10);

		// Consulta segura con placeholders
		let registrar = `
			INSERT INTO usuarios
			(nombre_completo, correo, contrasena) 
			VALUES (?, ?, ?)`;

		let valores = [nombre_completo, email, hashedPassword];

		db.query(registrar, valores, function(error) {
			if (error) {
				console.error("Error al registrar:", error);

				// Guardar alerta en sesión y redirigir a "/"
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
				console.log("Datos almacenados correctamente. Registro satisfactorio.");

				// Guardar alerta en sesión y redirigir a "/"
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

// Ruta para cerrar la sesión, es necesario un botón que dirija a está ruta
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

module.exports = router;
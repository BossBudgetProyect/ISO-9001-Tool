// Librerías necesarias para el funcionamiento
const express = require('express');
// const db = require('./db'); // Eliminado: No se usará base de datos local en Vercel
// const bcrypt = require('bcrypt'); // Eliminado: No se usará en este ejemplo solo con sesiones
const session = require('express-session'); // Manejo de sesiones
const path = require('path');
const flash = require('connect-flash'); // ← Añade esto para flash messages

// Instanciamos app y creamos una constante para el puerto por si cambia
const app = express();
const port = process.env.PORT || 3000;

// Creación de sesión para cada usuario:
app.use(session({
  secret: 'PruebaSxcrxtx',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 60 * 60 * 1000 } // 1 hora
}));

// Configurar flash messages ← Añade esto
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

// Configurar EJS
app.set('view engine', 'ejs');

// Permitimos almacenar los datos para que no queden como indefinidos / Middleware para leer datos de formulario
app.use(express.urlencoded({extended:true}));
app.use(express.json());

// Servir archivos estáticos
app.use(express.static('public'));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Eliminado para compatibilidad Vercel
app.use('/plantillas', express.static('plantillas'));

// Rutas de ejemplo usando solo sesión (sin base de datos)
app.get('/', (req, res) => {
  if (!req.session.user) {
    return res.render('login');
  }
  res.render('IsoSelect', { user: req.session.user });
});

app.post('/login', (req, res) => {
  const { correo, contrasena } = req.body;
  // Simulación de autenticación: cualquier usuario/contraseña
  req.session.user = { correo };
  res.redirect('/');
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});


// Ruta de prueba para verificar que el servidor funciona
app.get('/test', (req, res) => {
  res.send('✅ Servidor funcionando correctamente (sin base de datos)');
});

// Middleware para manejar rutas no encontradas
app.use((req, res) => {
  res.status(404).render('error', { 
    message: 'Página no encontrada',
    error: { status: 404 }
  });
});

// Localhost:
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
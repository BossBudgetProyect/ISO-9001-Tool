const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db');

// Middleware para verificar autenticación
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/normasIso');
}

// Configuración de multer para subir archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Crear carpeta por usuario si no existe
    const userUploadDir = path.join(__dirname, '../uploads', `usuario_${req.user.id}`);
    if (!fs.existsSync(userUploadDir)) {
      fs.mkdirSync(userUploadDir, { recursive: true });
    }
    cb(null, userUploadDir);
  },
  filename: function (req, file, cb) {
    // Mantener nombre original pero con prefijo de cláusula
    const plantillaId = req.params.id;
    const timestamp = Date.now();
    cb(null, `clausula_${plantillaId}_${timestamp}_${file.originalname}`);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedExtensions = ['.xlsx', '.xls'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de Excel (.xlsx, .xls)'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // Límite de 5MB
  }
});

// Obtener lista de plantillas
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    // Obtener plantillas
    const plantillas = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM plantillas WHERE norma = ? ORDER BY clausula', ['9001'], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    // Obtener archivos subidos por el usuario
    const archivosUsuario = await new Promise((resolve, reject) => {
      db.all(`
        SELECT au.plantilla_id, au.archivo_path, au.fecha_subida 
        FROM archivos_usuario au 
        WHERE au.usuario_id = ?
      `, [req.user.id], (err, rows) => {
        if (err) reject(err);
        else {
          const archivosMap = {};
          rows.forEach(row => {
            archivosMap[row.plantilla_id] = row;
          });
          resolve(archivosMap);
        }
      });
    });

    res.render('implementacion', { 
      plantillas, 
      archivosUsuario,
      user: req.user 
    });
  } catch (error) {
    console.error('Error al cargar la página de implementación:', error);
    res.status(500).render('error', { 
      message: 'Error al cargar la página de implementación',
      error: error 
    });
  }
});

// Descargar plantilla base
router.get('/descargar/:id', ensureAuthenticated, async (req, res) => {
  try {
    const plantilla = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM plantillas WHERE id = ?', [req.params.id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
    
    if (plantilla) {
      const filePath = path.join(__dirname, '..', plantilla.archivo_path);
      
      // Verificar si el archivo existe
      if (fs.existsSync(filePath)) {
        res.download(filePath, `${plantilla.clausula}_${plantilla.nombre}.xlsx`, (err) => {
          if (err) {
            console.error('Error al descargar:', err);
            req.flash('error_msg', 'Error al descargar la plantilla');
            res.redirect('/implementacion');
          }
        });
      } else {
        console.error('Archivo no encontrado:', filePath);
        req.flash('error_msg', 'Plantilla no disponible en este momento');
        res.redirect('/implementacion');
      }
    } else {
      req.flash('error_msg', 'Plantilla no encontrada');
      res.redirect('/implementacion');
    }
  } catch (error) {
    console.error('Error al descargar la plantilla:', error);
    req.flash('error_msg', 'Error al descargar la plantilla');
    res.redirect('/implementacion');
  }
});

// Subir plantilla completada
router.post('/subir/:id', ensureAuthenticated, upload.single('archivo'), async (req, res) => {
  try {
    if (!req.file) {
      req.flash('error_msg', 'No se ha seleccionado ningún archivo');
      return res.redirect('/implementacion');
    }
    
    // Verificar si ya existe un archivo subido para esta plantilla por este usuario
    const archivoExistente = await new Promise((resolve, reject) => {
      db.get(
        'SELECT id FROM archivos_usuario WHERE usuario_id = ? AND plantilla_id = ?',
        [req.user.id, req.params.id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
    
    if (archivoExistente) {
      // Eliminar el archivo físico anterior si existe
      try {
        if (fs.existsSync(archivoExistente.archivo_path)) {
          fs.unlinkSync(archivoExistente.archivo_path);
        }
      } catch (err) {
        console.error('Error al eliminar archivo anterior:', err);
      }
      
      // Actualizar archivo existente
      await new Promise((resolve, reject) => {
        db.run(
          'UPDATE archivos_usuario SET archivo_path = ?, fecha_subida = datetime("now") WHERE id = ?',
          [req.file.path, archivoExistente.id],
          function(err) {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    } else {
      // Insertar nuevo archivo
      await new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO archivos_usuario (usuario_id, plantilla_id, archivo_path) VALUES (?, ?, ?)',
          [req.user.id, req.params.id, req.file.path],
          function(err) {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    }
    
    req.flash('success_msg', 'Archivo subido correctamente');
    res.redirect('/implementacion');
  } catch (error) {
    console.error('Error al subir el archivo:', error);
    req.flash('error_msg', 'Error al subir el archivo: ' + error.message);
    res.redirect('/implementacion');
  }
});

// Eliminar archivo subido
router.post('/eliminar/:id', ensureAuthenticated, async (req, res) => {
  try {
    // Verificar que el archivo pertenece al usuario actual
    const archivo = await new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM archivos_usuario WHERE id = ? AND usuario_id = ?',
        [req.params.id, req.user.id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
    
    if (!archivo) {
      req.flash('error_msg', 'Archivo no encontrado');
      return res.redirect('/implementacion');
    }
    
    // Eliminar el archivo físico
    try {
      if (fs.existsSync(archivo.archivo_path)) {
        fs.unlinkSync(archivo.archivo_path);
      }
    } catch (err) {
      console.error('Error al eliminar archivo físico:', err);
    }
    
    // Eliminar el registro de la base de datos
    await new Promise((resolve, reject) => {
      db.run(
        'DELETE FROM archivos_usuario WHERE id = ?',
        [req.params.id],
        function(err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });
    
    req.flash('success_msg', 'Archivo eliminado correctamente');
    res.redirect('/implementacion');
  } catch (error) {
    console.error('Error al eliminar el archivo:', error);
    req.flash('error_msg', 'Error al eliminar el archivo');
    res.redirect('/implementacion');
  }
});

module.exports = router;
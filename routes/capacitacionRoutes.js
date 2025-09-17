const express = require('express');
const router = express.Router();
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

// Obtener lista de plantillas con contenido de capacitación
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    // Obtener plantillas con contenido de capacitación
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

    res.render('capacitacion', { 
      plantillas, 
      archivosUsuario,
      user: req.user 
    });
  } catch (error) {
    console.error('Error al cargar la página de capacitación:', error);
    res.status(500).render('error', { 
      message: 'Error al cargar la página de capacitación',
      error: error 
    });
  }
});

// Descargar plantilla de ejemplo desde capacitación
router.get('/descargar-ejemplo/:id', ensureAuthenticated, async (req, res) => {
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
        res.download(filePath, `${plantilla.clausula}_${plantilla.nombre}_ejemplo.xlsx`, (err) => {
          if (err) {
            console.error('Error al descargar:', err);
            req.flash('error_msg', 'Error al descargar la plantilla de ejemplo');
            res.redirect('/capacitacion');
          }
        });
      } else {
        console.error('Archivo no encontrado:', filePath);
        req.flash('error_msg', 'Plantilla de ejemplo no disponible');
        res.redirect('/capacitacion');
      }
    } else {
      req.flash('error_msg', 'Plantilla no encontrada');
      res.redirect('/capacitacion');
    }
  } catch (error) {
    console.error('Error al descargar la plantilla de ejemplo:', error);
    req.flash('error_msg', 'Error al descargar la plantilla de ejemplo');
    res.redirect('/capacitacion');
  }
});

// Ver archivo subido por el usuario
router.get('/ver-archivo/:id', ensureAuthenticated, async (req, res) => {
  try {
    // Verificar que el archivo pertenece al usuario actual
    const archivo = await new Promise((resolve, reject) => {
      db.get(`
        SELECT au.*, p.clausula, p.nombre 
        FROM archivos_usuario au 
        JOIN plantillas p ON au.plantilla_id = p.id 
        WHERE au.id = ? AND au.usuario_id = ?
      `, [req.params.id, req.user.id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
    
    if (!archivo) {
      req.flash('error_msg', 'Archivo no encontrado');
      return res.redirect('/capacitacion');
    }
    
    // Verificar si el archivo existe
    if (fs.existsSync(archivo.archivo_path)) {
      res.download(archivo.archivo_path, `${archivo.clausula}_${archivo.nombre}_completado.xlsx`, (err) => {
        if (err) {
          console.error('Error al descargar:', err);
          req.flash('error_msg', 'Error al visualizar el archivo');
          res.redirect('/capacitacion');
        }
      });
    } else {
      console.error('Archivo no encontrado:', archivo.archivo_path);
      req.flash('error_msg', 'El archivo ya no está disponible');
      res.redirect('/capacitacion');
    }
  } catch (error) {
    console.error('Error al visualizar el archivo:', error);
    req.flash('error_msg', 'Error al visualizar el archivo');
    res.redirect('/capacitacion');
  }
});

module.exports = router;
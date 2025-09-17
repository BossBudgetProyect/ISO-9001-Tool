const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const db = require('../db');
const { isAuthenticated } = require('../middlewares/authMiddleware');

// Obtener lista de plantillas con contenido de capacitación
router.get('/', isAuthenticated, async (req, res) => {
  try {
    // Obtener plantillas con contenido de capacitación
    const plantillas = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM plantillas WHERE norma = ? ORDER BY clausula', ['9001'], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    // Obtener archivos subidos por el usuario - ACTUALIZAR ESTA CONSULTA
    const archivosUsuario = await new Promise((resolve, reject) => {
      db.all(`
        SELECT au.id, au.plantilla_id, au.archivo_path, au.fecha_subida 
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

// Descargar archivo del usuario
router.get('/descargar-archivo/:id', isAuthenticated, async (req, res) => {
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
          req.flash('error_msg', 'Error al descargar el archivo');
          res.redirect('/capacitacion');
        }
      });
    } else {
      console.error('Archivo no encontrado:', archivo.archivo_path);
      req.flash('error_msg', 'El archivo ya no está disponible');
      res.redirect('/capacitacion');
    }
  } catch (error) {
    console.error('Error al descargar el archivo:', error);
    req.flash('error_msg', 'Error al descargar el archivo');
    res.redirect('/capacitacion');
  }
});

// Ver archivo subido por el usuario
router.get('/ver-archivo/:id', isAuthenticated, async (req, res) => {
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
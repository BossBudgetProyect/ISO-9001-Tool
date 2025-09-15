const express = require('express');
const router = express.Router();
const db = require('../db'); // Si necesitas usar la base de datos
const { isAuthenticated } = require('../middlewares/authMiddleware'); // Utilizamos el middleware de autenticación de sesiones

// Render ISO login/register
/*router.get('/normasIso', isAuthenticated, (req, res) => {
    const alertData = req.session.alertData || {};
    req.session.alertData = null;
    res.render('normasIso', alertData);
});*/

// Render ISO seleccionada
router.get('/IsoSelect', isAuthenticated, (req, res) => {
    const alertData = req.session.alertData || {};
    req.session.alertData = null;
    res.render('IsoSelect', alertData);
});

// Render ISO2
router.get('/IsoForm9001', isAuthenticated, (req, res) => {
    const alertData = req.session.alertData || {};
    req.session.alertData = null;
    res.render('IsoForm9001', alertData);
});

// POST - Registrar auditoría ISO 9001
router.post('/registro-iso', (req, res) => {
  const {
    razonSocial,
    nit,
    representanteLegal,
    sectorEconomico,
    tipoEmpresa,
    numeroEmpleados,
    direccion,
    telefonos,
    email,
    web,
    facebook,
    instagram,
    tiktok
  } = req.body;

  // Insertar en la tabla registro_iso
  const sql = `
    INSERT INTO registro_iso 
    (razon_social, nit, representante_legal, sector_economico, tipo_empresa, numero_empleados, direccion, telefonos, email, web, facebook, instagram, tiktok) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    razonSocial,
    nit,
    representanteLegal,
    sectorEconomico,
    tipoEmpresa,
    numeroEmpleados,
    direccion,
    telefonos,
    email,
    web,
    facebook,
    instagram,
    tiktok
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("❌ Error al registrar la auditoría ISO:", err);
      req.session.alertData = {
        alert: true,
        alertTitle: "Error",
        alertMessage: "No se pudo registrar la auditoría.",
        alertIcon: 'error',
        showConfirmButton: true,
        ruta: "/IsoSelect"
      };
      return res.redirect('/IsoSelect');
    }

    console.log("✅ Registro ISO insertado con ID:", result.insertId);
	
	/*Guardamos ID de la empresa para el checklist*/
	req.session.empresa_id = result.insertId;
	

    req.session.alertData = {
      alert: true,
      alertTitle: "Registro Exitoso",
      alertMessage: "La auditoría se registró correctamente.",
      alertIcon: 'success',
      showConfirmButton: true,
      ruta: "/IsoChecklist9001" // redirige al checklist
    };

    res.redirect('/IsoChecklist9001');
  });
});

// POST - Guardar resultados del checklist ISO 9001
router.post('/guardar-checklist', isAuthenticated, (req, res) => {
  const { empresa_id, resultados } = req.body;

  // Validar datos de entrada
  if (!empresa_id || !resultados || !Array.isArray(resultados)) {
    console.error("❌ Datos incompletos o inválidos:", req.body);
    return res.status(400).json({
      success: false,
      message: 'Datos incompletos: empresa_id y resultados son requeridos'
    });
  }

  // Iniciar transacción
  db.beginTransaction((err) => {
    if (err) {
      console.error("❌ Error al iniciar transacción:", err);
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }

    // Obtener mapeo de cláusulas a IDs
    db.query('SELECT id, clausula FROM iso_9001_checklist', (err, clausulas) => {
      if (err) {
        return db.rollback(() => {
          console.error("❌ Error al obtener cláusulas:", err);
          res.status(500).json({
            success: false,
            message: 'Error al obtener información de cláusulas'
          });
        });
      }

      // Crear mapa de cláusulas
      const clausulasMap = {};
      clausulas.forEach(row => {
        clausulasMap[row.clausula] = row.id;
      });

      let processed = 0;
      const total = resultados.length;

      // Si no hay resultados para procesar
      if (total === 0) {
        return db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              console.error("❌ Error al hacer commit:", err);
              res.status(500).json({
                success: false,
                message: 'Error al guardar los datos'
              });
            });
          }
          res.json({
            success: true,
            message: 'No hay datos que guardar'
          });
        });
      }

      // Procesar cada resultado
      resultados.forEach((resultado) => {
        const { clausula, estado, observaciones } = resultado;
        
        if (!clausulasMap[clausula]) {
          return db.rollback(() => {
            console.error("❌ Cláusula no encontrada:", clausula);
            res.status(400).json({
              success: false,
              message: `Cláusula no encontrada: ${clausula}`
            });
          });
        }

        const checklistId = clausulasMap[clausula];

        // Verificar si ya existe un registro
        db.query(
          'SELECT id FROM audit_results WHERE empresa_id = ? AND checklist_id = ?',
          [empresa_id, checklistId],
          (err, existingRecords) => {
            if (err) {
              return db.rollback(() => {
                console.error("❌ Error al verificar registro existente:", err);
                res.status(500).json({
                  success: false,
                  message: 'Error al verificar datos existentes'
                });
              });
            }

            if (existingRecords.length > 0) {
              // Actualizar registro existente
              db.query(
                'UPDATE audit_results SET estado = ?, observaciones = ?, fecha = NOW() WHERE empresa_id = ? AND checklist_id = ?',
                [estado, observaciones, empresa_id, checklistId],
                (err) => {
                  processed++;
                  if (err) {
                    return db.rollback(() => {
                      console.error("❌ Error al actualizar registro:", err);
                      res.status(500).json({
                        success: false,
                        message: 'Error al actualizar datos'
                      });
                    });
                  }

                  if (processed === total) {
                    finalizeTransaction();
                  }
                }
              );
            } else {
              // Insertar nuevo registro
              db.query(
                'INSERT INTO audit_results (empresa_id, checklist_id, estado, observaciones, fecha) VALUES (?, ?, ?, ?, NOW())',
                [empresa_id, checklistId, estado, observaciones],
                (err) => {
                  processed++;
                  if (err) {
                    return db.rollback(() => {
                      console.error("❌ Error al insertar registro:", err);
                      res.status(500).json({
                        success: false,
                        message: 'Error al insertar datos'
                      });
                    });
                  }

                  if (processed === total) {
                    finalizeTransaction();
                  }
                }
              );
            }
          }
        );
      });

      // Función para finalizar la transacción
      function finalizeTransaction() {
        db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              console.error("❌ Error al hacer commit:", err);
              res.status(500).json({
                success: false,
                message: 'Error al guardar los datos'
              });
            });
          }

          console.log("✅ Checklist guardado correctamente para empresa ID:", empresa_id);
          res.json({
            success: true,
            message: 'Checklist guardado correctamente'
          });
        });
      }
    });
  });
});

// Render ISO2
router.get('/IsoForm27001', isAuthenticated, (req, res) => {
    const alertData = req.session.alertData || {};
    req.session.alertData = null;
    res.render('IsoForm27001', alertData);
});

// Render ISO2
// Render ISO Checklist 9001
router.get('/IsoChecklist9001', isAuthenticated, (req, res) => {
    const alertData = req.session.alertData || {};
    req.session.alertData = null;
    
    // Pasar el empresa_id a la vista
    res.render('IsoChecklist9001', {
        ...alertData,
        empresa_id: req.session.empresa_id || null
    });
});

// Render ISO2
router.get('/IsoChecklist27001', isAuthenticated, (req, res) => {
    const alertData = req.session.alertData || {};
    req.session.alertData = null;
    res.render('IsoChecklist27001', alertData);
});

module.exports = router;
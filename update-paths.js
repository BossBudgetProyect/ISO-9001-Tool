// update-paths.js
/*const db = require('./db');

// Actualizar las rutas con los nombres reales de tus archivos
const updates = [
  { id: 1, clausula: "4.3", path: "4.3.+Plantilla+Alcance+formato.xlsx" },
  { id: 2, clausula: "4.4", path: "4.4.+Ficha+de+procesos+Formato.xlsx" },
  { id: 3, clausula: "5.1", path: "5.1.+Check+list+Liderazgo+Actual+Formato.xlsx" },
  { id: 4, clausula: "6.2", path: "6.2+Objetivos+de+calidad.xlsx" },
  { id: 5, clausula: "6.3", path: "6.3.+Planificación+de+los+cambios+formato.xlsx" },
  { id: 6, clausula: "7.1.4", path: "7.1.4.+Formato+Medición+de+condiciones+físicas.xlsx" },
  { id: 7, clausula: "7.1.6", path: "7.1.6.+Formato-Conocimientos+de+la+organización.xlsx" },
  { id: 8, clausula: "7.2", path: "7.2.+Formato-+Competencia.xlsx" },
  { id: 9, clausula: "7.3", path: "7.3.+Formato++-+Toma+de+conciencia.xlsx" },
  { id: 10, clausula: "7.5", path: "7.5.+Formato+-+Información+documentada.xlsx" },
  { id: 11, clausula: "8.1", path: "8.1.+Planificación+y+control+operacional.xlsx" },
  { id: 12, clausula: "8.2", path: "8.2.+Requisitos+para+los+productos+y+servicios+-+Formato.xlsx" },
  { id: 13, clausula: "8.4", path: "8.4+Control+de+los+procesos+externos.xlsx" },
  { id: 14, clausula: "8.5.2", path: "8.5.2.+Identificación+y+Trazabilidad+-+ADN+Lean.xlsx" },
  { id: 15, clausula: "8.6", path: "8.6.+Liberación+de+los+productos+y+servicios+formato.xlsx" },
  { id: 16, clausula: "8.7", path: "8.7.+Control+de+Salidas+no+conformes+Formato.xlsx" },
  { id: 17, clausula: "9.1", path: "9.1.+Seguimiento,+medición,+análisis+y+evaluación++-+Formato.xlsx" }
];

updates.forEach(update => {
  db.run(
    'UPDATE plantillas SET archivo_path = ? WHERE clausula = ?',
    [`./plantillas/iso9001/${update.path}`, update.clausula],
    function(err) {
      if (err) {
        console.error(`Error actualizando plantilla ${update.clausula}:`, err);
      } else {
        console.log(`✅ Plantilla ${update.clausula} actualizada: ${update.path}`);
      }
    }
  );
});*/

// update-db-paths.js
const db = require('./db');
const fs = require('fs');
const path = require('path');

async function updateDatabasePaths() {
  try {
    // Obtener todas las plantillas
    const plantillas = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM plantillas', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    const basePath = path.join(__dirname, 'plantillas', 'iso9001');
    const files = fs.readdirSync(basePath);
    
    console.log('Actualizando rutas en la base de datos...');
    
    for (const plantilla of plantillas) {
      // Buscar archivo que coincida con la cláusula
      const matchingFile = files.find(file => file.includes(plantilla.clausula));
      
      if (matchingFile) {
        const newPath = `./plantillas/iso9001/${matchingFile}`;
        
        // Actualizar la base de datos
        await new Promise((resolve, reject) => {
          db.run(
            'UPDATE plantillas SET archivo_path = ? WHERE id = ?',
            [newPath, plantilla.id],
            function(err) {
              if (err) reject(err);
              else resolve();
            }
          );
        });
        
        console.log(`✅ ${plantilla.clausula}: ${matchingFile}`);
      } else {
        console.log(`❌ ${plantilla.clausula}: NO ENCONTRADO`);
      }
    }
    
    console.log('Actualización completada.');
  } catch (error) {
    console.error('Error:', error);
  }
}

updateDatabasePaths();
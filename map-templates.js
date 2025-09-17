// map-templates.js
const fs = require('fs');
const path = require('path');
const db = require('./db');

async function mapTemplates() {
  try {
    const plantillas = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM plantillas ORDER BY clausula', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    const basePath = path.join(__dirname, 'plantillas', 'iso9001');
    const files = fs.readdirSync(basePath);
    
    console.log('=== MAPEO DE PLANTILLAS ===');
    console.log('Archivos encontrados en la carpeta:');
    files.forEach(file => console.log('  - ' + file));
    
    console.log('\n=== COINCIDENCIAS ===');
    
    plantillas.forEach(plantilla => {
      // Buscar archivos que coincidan con la cláusula
      const matchingFiles = files.filter(file => file.includes(plantilla.clausula));
      
      if (matchingFiles.length > 0) {
        console.log(`✅ ${plantilla.clausula}: ${matchingFiles.join(', ')}`);
        
        // Actualizar la base de datos con el primer archivo que coincida
        if (matchingFiles[0] !== plantilla.archivo_path.replace('./plantillas/iso9001/', '')) {
          db.run(
            'clea plantillas SET archivo_path = ? WHERE id = ?',
            [`./plantillas/iso9001/${matchingFiles[0]}`, plantilla.id],
            (err) => {
              if (err) {
                console.error(`   Error actualizando: ${err.message}`);
              } else {
                console.log(`   ✅ Actualizado en BD: ${matchingFiles[0]}`);
              }
            }
          );
        }
      } else {
        console.log(`❌ ${plantilla.clausula}: NO HAY ARCHIVOS QUE COINCIDAN`);
      }
    });
  } catch (error) {
    console.error('Error mapeando plantillas:', error);
  }
}

mapTemplates();
// delete-simple.js
const fs = require('fs');

console.log('🗑️ Eliminando base de datos...');

if (fs.existsSync('./ISOSystem.db')) {
  try {
    fs.unlinkSync('./ISOSystem.db');
    console.log('✅ Base de datos eliminada exitosamente');
    console.log('💡 Se recreará automáticamente al reiniciar el servidor');
  } catch (error) {
    console.error('❌ Error al eliminar:', error.message);
  }
} else {
  console.log('✅ La base de datos ya fue eliminada o no existe');
}

/*
<style>
        .clausula-card {
            margin-bottom: 20px;
            border: 1px solid #dee2e6;
            border-radius: 5px;
            transition: all 0.3s ease;
        }
        .clausula-card:hover {
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .clausula-header {
            background-color: #f8f9fa;
            padding: 15px;
            border-bottom: 1px solid #dee2e6;
            cursor: pointer;
        }
        .clausula-body {
            padding: 20px;
        }
        .contenido-capacitacion {
            background-color: #f0f8ff;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 15px;
        }
        .archivo-section {
            background-color: #e9ecef;
            padding: 15px;
            border-radius: 5px;
        }
        .btn-capacitacion {
            margin-top: 10px;
            margin-right: 10px;
        }
        .badge-estado {
            font-size: 0.8em;
            padding: 5px 10px;
            border-radius: 15px;
        }
</style>
    */
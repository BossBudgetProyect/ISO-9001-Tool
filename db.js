// db.js
const sqlite3 = require("sqlite3").verbose();

// Crear o abrir la base de datos local
const db = new sqlite3.Database("./ISOSystem.db", (err) => {
  if (err) {
    console.error("❌ Error al conectar con SQLite:", err.message);
  } else {
    console.log("✅ Conectado a la base de datos SQLite.");
  }
});

// Crear tablas
db.serialize(() => {
  // Usuarios
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre_completo TEXT NOT NULL,
      correo TEXT UNIQUE NOT NULL,
      contrasena TEXT NOT NULL,
      creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Empresas registradas
  db.run(`
    CREATE TABLE IF NOT EXISTS registro_iso (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      razon_social TEXT NOT NULL,
      nit TEXT NOT NULL UNIQUE,
      representante_legal TEXT NOT NULL,
      sector_economico TEXT NOT NULL,
      tipo_empresa TEXT NOT NULL,
      numero_empleados INTEGER NOT NULL,
      direccion TEXT NOT NULL,
      telefonos TEXT NOT NULL,
      email TEXT NOT NULL,
      web TEXT,
      facebook TEXT,
      instagram TEXT,
      tiktok TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Checklist ISO 9001
  db.run(`
    CREATE TABLE IF NOT EXISTS iso_9001_checklist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      clausula TEXT NOT NULL,
      titulo TEXT NOT NULL
    )
  `);

  // Resultados de auditoría
  db.run(`
    CREATE TABLE IF NOT EXISTS audit_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      empresa_id INTEGER NOT NULL,
      checklist_id INTEGER NOT NULL,
      estado TEXT NOT NULL,
      observaciones TEXT,
      fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (empresa_id) REFERENCES registro_iso(id) ON DELETE CASCADE,
      FOREIGN KEY (checklist_id) REFERENCES iso_9001_checklist(id) ON DELETE CASCADE
    )
  `);

  // Insertar datos iniciales en el checklist solo si está vacío
  db.get("SELECT COUNT(*) AS count FROM iso_9001_checklist", (err, row) => {
    if (err) {
      console.error("❌ Error verificando checklist:", err.message);
    } else if (row.count === 0) {
      console.log("ℹ️ Insertando datos iniciales en iso_9001_checklist...");
      const stmt = db.prepare(
        `INSERT INTO iso_9001_checklist (clausula, titulo) VALUES (?, ?)`
      );
      const data = [
        ["4.3", "Determinación del alcance del sistema de gestión de la calidad"],
        ["4.4", "Sistema de gestión de la calidad y sus procesos"],
        ["5.1", "Liderazgo y compromiso"],
        ["6.2", "Objetivos de la calidad y planificación para lograrlos"],
        ["6.3", "Planificación de los cambios"],
        ["7.1.4", "Ambiente para la operación de los procesos"],
        ["7.1.6", "Conocimientos de la organización"],
        ["7.2", "Competencia"],
        ["7.3", "Toma de conciencia"],
        ["7.5", "Información documentada"],
        ["8.1", "Planificación y control operacional"],
        ["8.2", "Requisitos para los productos y servicios"],
        ["8.4", "Control de los procesos, productos y servicios suministrados externamente"],
        ["8.5.2", "Identificación y trazabilidad"],
        ["8.6", "Liberación de los productos y servicios"],
        ["8.7", "Control de los elementos de la salida del proceso, productos y servicios no conformes"],
        ["9.1", "Seguimiento, medición, análisis y evaluación"],
      ];
      data.forEach((item) => stmt.run(item[0], item[1]));
      stmt.finalize();
    }
  });
});

module.exports = db;

// db.js
const sqlite3 = require("sqlite3").verbose();
const path = require('path');

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

  // Tabla para las plantillas disponibles (NUEVA)
  db.run(`
    CREATE TABLE IF NOT EXISTS plantillas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      clausula TEXT NOT NULL,
      nombre TEXT NOT NULL,
      descripcion TEXT,
      archivo_path TEXT NOT NULL,
      contenido_capacitacion TEXT,
      norma TEXT DEFAULT '9001',
      checklist_id INTEGER,
      FOREIGN KEY (checklist_id) REFERENCES iso_9001_checklist(id)
    )
  `);

  // Tabla para los archivos subidos por usuarios (NUEVA)
  db.run(`
    CREATE TABLE IF NOT EXISTS archivos_usuario (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      plantilla_id INTEGER NOT NULL,
      archivo_path TEXT NOT NULL,
      fecha_subida DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
      FOREIGN KEY (plantilla_id) REFERENCES plantillas(id)
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

  // Insertar datos iniciales en las plantillas solo si está vacío
  db.get("SELECT COUNT(*) AS count FROM plantillas", (err, row) => {
    if (err) {
      console.error("❌ Error verificando plantillas:", err.message);
    } else if (row.count === 0) {
      console.log("ℹ️ Insertando datos iniciales en plantillas...");
      const stmt = db.prepare(
        `INSERT INTO plantillas (clausula, nombre, descripcion, archivo_path, contenido_capacitacion, checklist_id) VALUES (?, ?, ?, ?, ?, ?)`
      );
      
      // Datos completos para las plantillas ISO 9001 (solo las que tienes)
      const plantillasData = [
        [
          "4.3", 
          "Alcance del SGC", 
          "Plantilla para definir el alcance del Sistema de Gestión de Calidad",
          "./plantillas/iso9001/4.3_alcance_sgc.xlsx",
          "En esta capacitación aprenderá a definir adecuadamente el alcance de su Sistema de Gestión de Calidad según los requisitos de la norma ISO 9001:2015. El alcance debe definir los límites y aplicabilidad del SGC, considerando el contexto de la organización y las necesidades de las partes interesadas.",
          1
        ],
        [
          "4.4", 
          "Procesos del SGC", 
          "Plantilla para documentar los procesos del Sistema de Gestión de Calidad",
          "./plantillas/iso9001/4.4_procesos_sgc.xlsx",
          "Esta capacitación cubre la identificación, secuencia e interacción de los procesos de su organización. Aprenderá a documentar los procesos, sus entradas, salidas, responsables y indicadores de desempeño.",
          2
        ],
        [
          "5.1", 
          "Compromiso de liderazgo", 
          "Plantilla para evidenciar el compromiso de la dirección",
          "./plantillas/iso9001/5.1_compromiso_liderazgo.xlsx",
          "En esta sección se explica cómo demostrar el compromiso de la alta dirección con el SGC, incluyendo la toma de responsabilidad, la integración con procesos business y la promoción de la mejora continua.",
          3
        ],
        [
          "6.2", 
          "Objetivos de calidad", 
          "Plantilla para establecer objetivos de calidad y planificar su consecución",
          "./plantillas/iso9001/6.2_objetivos_calidad.xlsx",
          "Esta capacitación cubre el establecimiento de objetivos de calidad medibles y coherentes con la política de calidad, y la planificación de acciones para lograrlos.",
          4
        ],
        [
          "6.3", 
          "Planificación de cambios", 
          "Plantilla para planificar cambios en el SGC",
          "./plantillas/iso9001/6.3_planificacion_cambios.xlsx",
          "Aprenda a planificar cambios en el SGC de manera controlada, considerando el propósito de los cambios y sus potenciales consecuencias.",
          5
        ],
        [
          "7.1.4", 
          "Ambiente de procesos", 
          "Plantilla para determinar y gestionar el ambiente para la operación de procesos",
          "./plantillas/iso9001/7.1.4_ambiente_procesos.xlsx",
          "Esta plantilla le ayudará a determinar, proporcionar y mantener el ambiente necesario para la operación de sus procesos.",
          6
        ],
        [
          "7.1.6", 
          "Conocimientos organizacionales", 
          "Plantilla para gestionar los conocimientos de la organización",
          "./plantillas/iso9001/7.1.6_conocimientos_organizacion.xlsx",
          "Aprenda a determinar los conocimientos necesarios para la operación de sus procesos y para lograr la conformidad de productos y servicios.",
          7
        ],
        [
          "7.2", 
          "Competencia", 
          "Plantilla para determinar y gestionar la competencia del personal",
          "./plantillas/iso9001/7.2_competencia.xlsx",
          "Esta capacitación cubre la determinación de la competencia necesaria del personal que realiza trabajo bajo su control que afecta el desempeño del SGC.",
          8
        ],
        [
          "7.3", 
          "Toma de conciencia", 
          "Plantilla para asegurar que el personal es consciente de la política y objetivos de calidad",
          "./plantillas/iso9001/7.3_toma_conciencia.xlsx",
          "Aprenda a asegurar que el personnel es consciente de la política de calidad, los objetivos relevantes y su contribución a la efectividad del SGC.",
          9
        ],
        [
          "7.5", 
          "Información documentada", 
          "Plantilla para controlar la información documentada del SGC",
          "./plantillas/iso9001/7.5_informacion_documentada.xlsx",
          "Esta plantilla le ayudará a controlar la información documentada requerida por la norma ISO 9001 y la necesaria para la efectividad del SGC.",
          10
        ],
        [
          "8.1", 
          "Planificación operacional", 
          "Plantilla para planificar y controlar las operaciones",
          "./plantillas/iso9001/8.1_planificacion_operacional.xlsx",
          "Aprenda a planificar, implementar y controlar los procesos necesarios para cumplir con los requisitos para la provisión de productos y servicios.",
          11
        ],
        [
          "8.2", 
          "Requisitos de productos y servicios", 
          "Plantilla para determinar requisitos de productos y servicios",
          "./plantillas/iso9001/8.2_requisitos_productos_servicios.xlsx",
          "Esta capacitación cubre la determinación de los requisitos para los productos y servicios a ser ofrecidos a los clientes.",
          12
        ],
        [
          "8.4", 
          "Control de procesos externos", 
          "Plantilla para controlar procesos, productos y servicios suministrados externamente",
          "./plantillas/iso9001/8.4_control_procesos_externos.xlsx",
          "Aprenda a asegurar que los procesos, productos y servicios suministrados externamente conformen los requisitos especificados.",
          13
        ],
        [
          "8.5.2", 
          "Identificación y trazabilidad", 
          "Plantilla para gestionar identificación y trazabilidad",
          "./plantillas/iso9001/8.5.2_identificacion_trazabilidad.xlsx",
          "Esta plantilla le ayudará a identificar las salidas cuando sea necesario para asegurar la conformidad de productos y servicios, y a implementar la trazabilidad cuando sea requerida.",
          14
        ],
        [
          "8.6", 
          "Liberación de productos", 
          "Plantilla para implementar la liberación de productos y servicios",
          "./plantillas/iso9001/8.6_liberacion_productos.xlsx",
          "Aprenda a implementar arreglos para asegurar que los productos y servicios no sean liberados hasta que se verifique el cumplimiento de los requisitos especificados.",
          15
        ],
        [
          "8.7", 
          "Control de no conformidades", 
          "Plantilla para controlar productos y servicios no conformes",
          "./plantillas/iso9001/8.7_control_no_conformidades.xlsx",
          "Esta capacitación cubre la identificación y control de los productos y servicios que no conformen los requisitos, para prevenir su uso o entrega no intencional.",
          16
        ],
        [
          "9.1", 
          "Seguimiento y medición", 
          "Plantilla para planificar el seguimiento, medición, análisis y evaluación",
          "./plantillas/iso9001/9.1_seguimiento_medicion.xlsx",
          "Aprenda a determinar qué necesita ser monitoreado y medido, los métodos para ello, cuándo debe realizarse y cuándo deben analizarse y evaluarse los resultados.",
          17
        ]
      ];
      
      plantillasData.forEach((item) => stmt.run(...item));
      stmt.finalize();
    }
  });
});

module.exports = db;
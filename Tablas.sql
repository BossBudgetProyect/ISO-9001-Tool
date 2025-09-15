CREATE DATABASE ISOSystem;
USE ISOSystem;
DROP DATABASE ISOSystem;

-- Usuarios del sistema
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(150) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL, -- siempre encriptada
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Empresas registradas para auditoría ISO
CREATE TABLE registro_iso (
    id INT AUTO_INCREMENT PRIMARY KEY,
    -- Información de la empresa
    razon_social VARCHAR(255) NOT NULL,
    nit VARCHAR(50) NOT NULL UNIQUE,
    representante_legal VARCHAR(255) NOT NULL,
    sector_economico ENUM(
        'manufactura',
        'tecnologia',
        'servicios',
        'comercio',
        'salud',
        'financiero',
        'educacion',
        'construccion',
        'agricultura',
        'otros'
    ) NOT NULL,
    tipo_empresa ENUM(
        'sociedad_anonima',
        'sociedad_ltda',
        'empresa_unipersonal',
        'sociedad_colectiva',
        'cooperativa',
        'microempresa',
        'pyme',
        'gran_empresa'
    ) NOT NULL,
    numero_empleados INT NOT NULL,
    -- Información de contacto
    direccion VARCHAR(255) NOT NULL,
    telefonos VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    -- Información digital
    web VARCHAR(255),
    facebook VARCHAR(255),
    instagram VARCHAR(255),
    tiktok VARCHAR(255),
    -- Control
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Checklist ISO 9001 (cláusulas fijas, precargadas en la BD)
CREATE TABLE iso_9001_checklist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    clausula VARCHAR(20) NOT NULL, -- ej: "4.1", "5.2.1"
    titulo VARCHAR(255) NOT NULL
);

INSERT INTO iso_9001_checklist (clausula, titulo) VALUES
('4.3', 'Determinación del alcance del sistema de gestión de la calidad'),
('4.4', 'Sistema de gestión de la calidad y sus procesos'),
('5.1', 'Liderazgo y compromiso'),
('6.2', 'Objetivos de la calidad y planificación para lograrlos'),
('6.3', 'Planificación de los cambios'),
('7.1.4', 'Ambiente para la operación de los procesos'),
('7.1.6', 'Conocimientos de la organización'),
('7.2', 'Competencia'),
('7.3', 'Toma de conciencia'),
('7.5', 'Información documentada'),
('8.1', 'Planificación y control operacional'),
('8.2', 'Requisitos para los productos y servicios'),
('8.4', 'Control de los procesos, productos y servicios suministrados externamente'),
('8.5.2', 'Identificación y trazabilidad'),
('8.6', 'Liberación de los productos y servicios'),
('8.7', 'Control de los elementos de la salida del proceso, productos y servicios no conformes'),
('9.1', 'Seguimiento, medición, análisis y evaluación');

-- Resultados de auditoría: empresa ↔ cláusula
CREATE TABLE audit_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT NOT NULL,
    checklist_id INT NOT NULL,
    estado ENUM('Cumple','No cumple','No aplica') NOT NULL,
    observaciones TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES registro_iso(id) ON DELETE CASCADE,
    FOREIGN KEY (checklist_id) REFERENCES iso_9001_checklist(id) ON DELETE CASCADE
);

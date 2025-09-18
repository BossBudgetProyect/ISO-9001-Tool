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
        "./plantillas/iso9001/4.3.+Plantilla+Alcance+formato.xlsx",
        `# Alcance del Sistema de Gestión de Calidad

    ## Objetivo
    Definir los límites y aplicabilidad del Sistema de Gestión de Calidad (SGC) de acuerdo con los requisitos de la norma ISO 9001:2015.

    ## ¿Qué debe incluir el alcance?
    - **Productos y servicios cubiertos**: Identifique claramente qué productos y servicios están incluidos en el SGC.
    - **Ubicaciones y unidades organizacionales**: Especifique las sedes, departamentos o procesos incluidos.
    - **Exclusiones justificadas**: Si existen requisitos de la norma que no aplican, deben estar justificados documentalmente.

    ## Consideraciones clave
    - El alcance debe ser coherente con el contexto de la organización y las necesidades de las partes interesadas.
    - Debe reflejar los productos y servicios que afectan la capacidad de la organización para cumplir con los requisitos del cliente.
    - Las exclusiones no pueden afectar la capacidad o responsabilidad de la organización para proveer productos y servicios que cumplan con los requisitos.

    ## Proceso de definición
    1. Analice el contexto de la organización
    2. Identifique las partes interesadas relevantes
    3. Determine los límites del sistema
    4. Documente y comunique el alcance`,
            1
          ],
          [
            "4.4", 
            "Procesos del SGC", 
            "Plantilla para documentar los procesos del Sistema de Gestión de Calidad",
            "./plantillas/iso9001/4.4_procesos_sgc.xlsx",
            `# Sistema de Gestión de Calidad y sus Procesos

    ## Objetivo
    Establecer, implementar, mantener y mejorar continuamente un sistema de gestión de calidad efectivo.

    ## Elementos clave del SGC
    - **Procesos interrelacionados**: Identifique cómo los procesos se conectan y afectan entre sí.
    - **Criterios y métodos**: Establezca cómo se operan y controlan los procesos.
    - **Recursos necesarios**: Determine los recursos requeridos para cada proceso.
    - **Riesgos y oportunidades**: Identifique y aborde los riesgos en cada proceso.

    ## Enfoque basado en procesos
    El enfoque de procesos implica:
    - La identificación sistemática de los procesos de la organización
    - La definición de interacciones entre procesos
    - La determinación de criterios y métodos para operar procesos
    - La asignación de responsabilidades y autoridades

    ## Mejora continua
    El SGC debe promover la mejora continua mediante:
    - La revisión periódica de procesos
    - La implementación de acciones correctivas
    - La evaluación del desempeño de procesos
    - La identificación de oportunidades de mejora`,
            2
          ],
          [
            "5.1", 
            "Compromiso de liderazgo", 
            "Plantilla para evidenciar el compromiso de la dirección",
            "./plantillas/iso9001/5.1_compromiso_liderazgo.xlsx",
            `# Liderazgo y Compromiso

    ## Responsabilidades de la alta dirección
    La alta dirección debe demostrar liderazgo y compromiso mediante:

    ### Acciones específicas
    - **Asegurar la integración** del SGC con los procesos business de la organización
    - **Promover el enfoque al cliente** en todos los niveles
    - **Establecer la política de calidad** y asegurar que se comprenda
    - **Asignar recursos** necesarios para el SGC
    - **Conducir revisiones por la dirección** periódicas

    ### Evidencias de compromiso
    - Comunicación activa sobre la importancia de la calidad
    - Participación en revisiones del SGC
    - Toma de decisiones basada en datos del SGC
    - Reconocimiento de contribuciones al SGC

    ### Beneficios del liderazgo efectivo
    - Mejora en la cultura de calidad organizacional
    - Mayor compromiso del personal
    - Mejor alineación con objetivos estratégicos
    - Mayor satisfacción del cliente`,
            3
          ],
          [
            "6.2", 
            "Objetivos de calidad", 
            "Plantilla para establecer objetivos de calidad y planificar su consecución",
            "./plantillas/iso9001/6.2_objetivos_calidad.xlsx",
            `# Objetivos de la Calidad y Planificación

    ## Características de objetivos efectivos (SMART)
    - **Específicos**: Claramente definidos y enfocados
    - **Medibles**: Cuantificables con indicadores
    - **Alcanzables**: Realistas y posibles de lograr
    - **Relevantes**: Alineados con la política de calidad
    - **Temporales**: Con plazos definidos

    ## Proceso de establecimiento
    1. **Derivación de la política**: Los objetivos deben apoyar la política de calidad
    2. **Consideración del contexto**: Analice factores internos y externos
    3. **Evaluación de riesgos**: Identifique obstáculos potenciales
    4. **Asignación de recursos**: Determine lo necesario para lograr los objetivos

    ## Ejemplos de objetivos
    - Reducir defectos en un 15% en los próximos 6 meses
    - Mejorar la satisfacción del cliente al 95% en el próximo año
    - Reducir tiempos de entrega en un 20% para fin de año
    - Implementar 3 mejoras de procesos por trimestre

    ## Seguimiento y revisión
    - Establezca indicadores de desempeño (KPIs)
    - Defina frecuencia de medición
    - Asigne responsables del seguimiento
    - Establezca acciones cuando no se cumplan los objetivos`,
            4
          ],
          [
            "6.3", 
            "Planificación de cambios", 
            "Plantilla para planificar cambios en el SGC",
            "./plantillas/iso9001/6.3_planificacion_cambios.xlsx",
            `# Planificación de los Cambios

    ## Enfoque sistemático para cambios
    La organización debe planificar cambios de manera controlada considerando:

    ### Aspectos a considerar
    - **Propósito del cambio**: ¿Por qué es necesario?
    - **Consecuencias potenciales**: Impacto en procesos, productos y personas
    - **Integridad del SGC**: Cómo afecta al sistema completo
    - **Disponibilidad de recursos**: Recursos necesarios para implementar el cambio

    ### Tipos de cambios
    - **Cambios estratégicos**: Modificaciones en dirección o enfoque
    - **Cambios operativos**: Ajustes en procesos o procedimientos
    - **Cambios tecnológicos**: Implementación de nuevas tecnologías
    - **Cambios organizacionales**: Reestructuraciones o nuevas asignaciones

    ### Proceso de planificación
    1. **Identificación de necesidad**: Detectar qué debe cambiar
    2. **Evaluación de impacto**: Analizar consecuencias
    3. **Planificación detallada**: Desarrollar plan de implementación
    4. **Comunicación**: Informar a todas las partes afectadas
    5. **Implementación**: Ejecutar el cambio controladamente
    6. **Verificación**: Confirmar que el cambio funciona como se planeó`,
            5
          ],
          [
            "7.1.4", 
            "Ambiente de procesos", 
            "Plantilla para determinar y gestionar el ambiente para la operación de procesos",
            "./plantillas/iso9001/7.1.4_ambiente_procesos.xlsx",
            `# Ambiente para la Operación de Procesos

    ## Componentes del ambiente de trabajo
    El ambiente incluye condiciones físicas, ambientales y otros factores que afectan la calidad:

    ### Factores físicos
    - **Espacio de trabajo**: Diseño, distribución y ergonomía
    - **Temperatura y humedad**: Control climático apropiado
    - **Iluminación**: Nivales adecuados para las actividades
    - **Ruido**: Control de niveles sonoros

    ### Factores ambientales
    - **Ventilación**: Calidad del aire y circulación
    - **Limpieza**: Mantenimiento de condiciones higiénicas
    - **Seguridad**: Protección contra riesgos

    ### Factores humanos
    - **Ergonomía**: Diseño amigable para los usuarios
    - **Estrés**: Gestión de cargas de trabajo
    - **Bienestar**: Consideraciones de comodidad y salud

    ## Gestión del ambiente
    - Establezca criterios para condiciones ambientales
    - Monitoree regularmente las condiciones
    - Implemente controles cuando sea necesario
    - Documente los requisitos ambientales`,
            6
          ],
          [
        "7.1.6", 
        "Conocimientos organizacionales", 
        "Plantilla para gestionar los conocimientos de la organización",
        "./plantillas/iso9001/7.1.6_conocimientos_organizacion.xlsx",
        `# Conocimientos de la Organización

    ## Objetivo
    Determinar y gestionar los conocimientos necesarios para la operación de procesos y lograr la conformidad de productos y servicios.

    ## Tipos de conocimientos
    - **Conocimientos tácitos**: Experiencia y habilidades del personal
    - **Conocimientos explícitos**: Documentación, procedimientos y bases de datos
    - **Conocimientos externos**: Información de clientes, proveedores y partes interesadas

    ## Gestión del conocimiento
    - **Identificación**: Detectar qué conocimientos son críticos para la organización
    - **Captura**: Documentar y almacenar conocimientos importantes
    - **Compartir**: Facilitar el acceso y transferencia de conocimientos
    - **Protección**: Salvaguardar conocimientos críticos contra pérdida
    - **Actualización**: Mantener los conocimientos relevantes y actualizados

    ## Fuentes de conocimiento
    - Experiencia interna del personal
    - Lecciones aprendidas de proyectos
    - Información de clientes y proveedores
    - Investigación y desarrollo
    - Benchmarking y mejores prácticas

    ## Prevención de pérdida
    - Plan de sucesión para posiciones críticas
    - Documentación de procesos clave
    - Programas de mentoría y capacitación
    - Bases de datos de lecciones aprendidas`,
        7
      ],
      [
        "7.2", 
        "Competencia", 
        "Plantilla para determinar y gestionar la competencia del personal",
        "./plantillas/iso9001/7.2_competencia.xlsx",
        `# Competencia

    ## Determinación de competencias
    Identifique las competencias necesarias para el personal que realiza trabajo bajo el control de la organización que afecta el desempeño del SGC.

    ### Proceso de evaluación
    1. **Identificar requisitos**: Determinar competencias necesarias por puesto
    2. **Evaluar brechas**: Comparar competencias actuales vs. requeridas
    3. **Implementar acciones**: Capacitación, contratación o reasignación
    4. **Verificar efectividad**: Evaluar si se cerraron las brechas

    ## Métodos de desarrollo de competencias
    - **Capacitación interna**: Programas desarrollados por la organización
    - **Capacitación externa**: Cursos, seminarios y certificaciones
    - **Mentoría**: Aprendizaje guiado por personal experimentado
    - **Rotación de puestos**: Experiencia en diferentes áreas
    - **Autoaprendizaje**: Recursos y materiales de estudio

    ## Evidencia de competencia
    - Certificados y diplomas
    - Registros de evaluación de desempeño
    - Resultados de pruebas y exámenes
    - Observación directa del trabajo
    - Feedback de supervisores y clientes

    ## Mantenimiento de competencias
    - Actualización periódica de requisitos
    - Evaluación continua del desempeño
    - Planes de desarrollo individual
    - Seguimiento de acciones de capacitación`,
        8
      ],
      [
        "7.3", 
        "Toma de conciencia", 
        "Plantilla para asegurar que el personal es consciente de la política y objetivos de calidad",
        "./plantillas/iso9001/7.3_toma_conciencia.xlsx",
        `# Toma de Conciencia

    ## Objetivo
    Asegurar que el personal es consciente de:
    - La política de calidad
    - Los objetivos de calidad relevantes
    - Su contribución a la efectividad del SGC
    - Las implicaciones de no conformarse con los requisitos

    ## Estrategias de comunicación
    - **Comunicación formal**: Reuniones, boletines y carteleras
    - **Comunicación informal**: Conversaciones y feedback diario
    - **Comunicación visual**: Carteles, pantallas y material gráfico
    - **Comunicación digital**: Correos, intranet y redes internas

    ## Contenido clave a comunicar
    - Importancia del cumplimiento de requisitos
    - Beneficios del SGC para la organización
    - Rol de cada persona en el logro de objetivos
    - Consecuencias de no seguir los procedimientos
    - Logros y éxitos del SGC

    ## Medición de efectividad
    - Encuestas de satisfacción y conocimiento
    - Pruebas de comprensión de políticas
    - Observación de comportamientos
    - Análisis de no conformidades relacionadas
    - Feedback en reuniones y evaluaciones

    ## Programa de concienciación
    - Inducción para nuevo personal
    - Capacitación periódica de refresco
    - Campañas temáticas específicas
    - Reconocimiento de contribuciones
    - Comunicación de casos de éxito`,
        9
      ],
      [
        "7.5", 
        "Información documentada", 
        "Plantilla para controlar la información documentada del SGC",
        "./plantillas/iso9001/7.5_informacion_documentada.xlsx",
        `# Información Documentada

    ## Tipos de información documentada
    - **Documentos requeridos por la norma**: Política, objetivos, procedimientos
    - **Documentos necesarios para efectividad**: Instrucciones, formatos, guías
    - **Registros**: Evidencia de actividades realizadas y resultados obtenidos

    ## Control de documentos
    ### Creación y actualización
    - Identificación apropiada (códigos, versiones)
    - Revisión y aprobación antes de emisión
    - Control de cambios y revisiones
    - Accesibilidad para usuarios autorizados

    ### Distribución y acceso
    - Disponibilidad donde se necesite
    - Protección contra modificaciones no autorizadas
    - Control de copias no controladas
    - Acceso para partes interesadas relevantes

    ### Conservación y disposición
    - Tiempos de retención definidos
    - Protección contra deterioro o pérdida
    - Disposición controlada cuando ya no se necesiten
    - Archivo histórico cuando corresponda

    ## Medios de almacenamiento
    - Documentos físicos en papel
    - Archivos digitales en sistemas electrónicos
    - Bases de datos y sistemas especializados
    - Almacenamiento en la nube con controles de seguridad

    ## Mejoras continuas
    - Revisión periódica de documentos
    - Actualización basada en cambios y lecciones aprendidas
    - Simplificación y eliminación de documentos obsoletos
    - Digitalización y optimización de procesos documentales`,
        10
      ],
      [
        "8.1", 
        "Planificación operacional", 
        "Plantilla para planificar y controlar las operaciones",
        "./plantillas/iso9001/8.1_planificacion_operacional.xlsx",
        `# Planificación y Control Operacional

    ## Proceso de planificación
    Planifique, implemente y controle los procesos necesarios para cumplir con los requisitos para la provisión de productos y servicios.

    ### Elementos de la planificación
    - **Determinación de requisitos**: Especificaciones del producto/servicio
    - **Establecimiento de criterios**: Parámetros para procesos y productos
    - **Determinación de recursos**: Personas, equipos, materiales e información
    - **Controles de proceso**: Métodos de monitoreo y medición

    ## Criterios de aceptación
    Establezca criterios para:
    - Los procesos de producción y prestación de servicio
    - La aceptación de productos y servicios
    - La liberación de productos y servicios
    - La entrega y actividades posteriores a la entrega

    ## Control de cambios
    - Evaluación de consecuencias de cambios
    - Autorización de cambios antes de implementación
    - Comunicación de cambios a partes afectadas
    - Verificación de que cambios se implementaron correctamente

    ## Documentación de procesos
    - Procedimientos e instrucciones de trabajo
    - Especificaciones técnicas y parámetros
    - Diagramas de flujo y mapas de procesos
    - Formatos de registro y control

    ## Mejora continua
    - Análisis de datos de procesos
    - Identificación de oportunidades de mejora
    - Implementación de acciones correctivas
    - Verificación de efectividad de mejoras`,
        11
      ],
      [
        "8.2", 
        "Requisitos de productos y servicios", 
        "Plantilla para determinar requisitos de productos y servicios",
        "./plantillas/iso9001/8.2_requisitos_productos_servicios.xlsx",
        `# Requisitos para los Productos y Servicios

    ## Determinación de requisitos
    ### Requisitos especificados por el cliente
    - Requisitos explícitos en órdenes o contratos
    - Requisitos implícitos (expectativas del cliente)
    - Requisitos legales y regulatorios aplicables
    - Requisitos adicionales determinados por la organización

    ### Comunicación con el cliente
    - Información sobre productos y servicios
    - Consultas, contratos y handling de órdenes
    - Feedback del cliente incluyendo quejas
    - Handling de situaciones de emergencia

    ## Revisión de requisitos
    ### Antes de comprometerse a suministrar
    - Verificar que requisitos están definidos adecuadamente
    - Resolver requisitos contradictorios o incompletos
    - Confirmar que la organización puede cumplir requisitos

    ### Cuando los requisitos cambian
    - Actualizar documentación relevante
    - Informar al personal afectado por cambios
    - Asegurar que cambios se implementen correctamente

    ## Registros de revisión
    - Resultados de la revisión de requisitos
    - Acciones resultantes de la revisión
    - Nuevos requisitos identificados
    - Acuerdos con el cliente sobre cambios

    ## Gestión de expectativas
    - Comunicación clara de capacidades y limitaciones
    - Manejo proactivo de requisitos no convencionales
    - Educación del cliente sobre opciones disponibles
    - Negociación de plazos y especificaciones realistas`,
        12
      ],
      [
        "8.4", 
        "Control de procesos externos", 
        "Plantilla para controlar procesos, productos y servicios suministrados externamente",
        "./plantillas/iso9001/8.4_control_procesos_externos.xlsx",
        `# Control de los Procesos, Productos y Servicios Suministrados Externaente

    ## Tipos de suministros externos
    - **Productos**: Materias primas, componentes, productos terminados
    - **Servicios**: Transporte, mantenimiento, consultoría, testing
    - **Procesos**: Subcontratación de procesos completos
    - **Personal**: Trabajadores temporales o contratados

    ## Criterios de selección
    - **Capacidad técnica**: Habilidad para cumplir requisitos
    - **Desempeño histórico**: Track record y referencias
    - **Certificaciones**: Sistemas de gestión implementados
    - **Capacidad financiera**: Estabilidad económica del proveedor

    ## Verificación de productos externos
    - **Inspección de recepción**: Verificación al ingresar productos
    - **Certificados de conformidad**: Documentación del proveedor
    - **Auditorías en sitio**: Evaluación en instalaciones del proveedor
    - **Monitoreo de desempeño**: Seguimiento continuo de calidad

    ## Acciones ante no conformidades
    - Rechazo de productos no conformes
    - Notificación al proveedor de problemas
    - Solicitud de acciones correctivas
    - Reevaluación del status de aprobación

    ## Mejora de proveedores
    - Programas de desarrollo de proveedores
    - Compartir mejores prácticas y requerimientos
    - Reconocimiento a proveedores destacados
    - Revisión conjunta de desempeño y oportunidades`,
        13
      ],
      [
        "8.5.2", 
        "Identificación y trazabilidad", 
        "Plantilla para gestionar identificación y trazabilidad",
        "./plantillas/iso9001/8.5.2_identificacion_trazabilidad.xlsx",
        `# Identificación y Trazabilidad

    ## Identificación de productos
    - **Propósito**: Distinguir productos o servicios entre sí
    - **Métodos**: Etiquetas, códigos, números de serie, colores
    - **Requisitos**: Identificación única cuando sea necesario
    - **Alcance**: Desde recepción hasta entrega al cliente

    ## Trazabilidad
    ### Cuando sea requerida
    - **Requisitos regulatorios**: Industrias médica, aeronáutica, alimentaria
    - **Requisitos del cliente**: Especificaciones contractuales
    - **Necesidades internas**: Investigación de no conformidades

    ### Sistema de trazabilidad
    - **Identificación única**: Códigos o números de lote
    - **Registros de seguimiento**: Documentación de movimientos
    - **Vinculación de información**: Relación entre componentes y producto final
    - **Recuperación de información**: Capacidad de rastrear historial completo

    ## Control de estatus
    - **Estatus de inspección**: Pendiente, aprobado, rechazado
    - **Estatus de proceso**: En proceso, completado, en hold
    - **Estatus de entrega**: Por despachar, despachado, entregado

    ## Tecnologías de identificación
    - Códigos de barras y QR
    - Sistemas RFID
    - Software de gestión de inventarios
    - Sistemas ERP integrados

    ## Beneficios de trazabilidad
    - Recall rápido y efectivo de productos
    - Investigación eficiente de no conformidades
    - Mejora en gestión de inventarios
    - Mayor confianza del cliente`,
        14
      ],
      [
        "8.6", 
        "Liberación de productos", 
        "Plantilla para implementar la liberación de productos y servicios",
        "./plantillas/iso9001/8.6_liberacion_productos.xlsx",
        `# Liberación de los Productos y Servicios

    ## Proceso de liberación
    Implemente arreglos para asegurar que los productos y servicios no sean liberados hasta que se verifique el cumplimiento de los requisitos especificados.

    ### Verificación de conformidad
    - **Inspección final**: Verificación completa antes de liberación
    - **Pruebas y ensayos**: Evaluación de características específicas
    - **Documentación revisada**: Confirmación de registros completos
    - **Embalaje y etiquetado**: Verificación de presentación final

    ## Autoridad de liberación
    - **Personal autorizado**: Individuos con training y autoridad
    - **Procedimientos definidos**: Criterios claros para liberación
    - **Registros de liberación**: Evidencia de verificación realizada
    - **Sistemas automatizados**: Liberación mediante sistemas electrónicos

    ## Liberación por etapas
    - **Liberación parcial**: Cuando aplicable por fases del proceso
    - **Liberación condicional**: Con restricciones o condiciones específicas
    - **Liberación de muestras**: Para aprobación inicial o testing

    ## Situaciones especiales
    - **Liberación de emergencia**: Procedimientos para casos urgentes
    - **Liberación con concesión**: Cuando se aceptan desviaciones
    - **Liberación de producto no conforme**: Solo con autorización explícita

    ## Registros de liberación
    - Certificados de conformidad
    - Reportes de inspección final
    - Autorizaciones de liberación
    - Evidencia de cumplimiento de requisitos`,
        15
      ],
      [
        "8.7", 
        "Control de no conformidades", 
        "Plantilla para controlar productos y servicios no conformes",
        "./plantillas/iso9001/8.7_control_no_conformidades.xlsx",
        `# Control de los Productos y Servicios No Conformes

    ## Identificación de no conformidades
    - **Detección**: Durante inspección, producción o uso
    - **Documentación**: Registro de la no conformidad identificada
    - **Clasificación**: Por tipo, severidad y frecuencia

    ## Acciones inmediatas
    - **Contención**: Aislar producto para prevenir uso no intencional
    - **Identificación**: Etiquetar claramente como no conforme
    - **Evaluación**: Determinar impacto y acciones necesarias

    ## Disposición de producto no conforme
    ### Opciones de disposición
    - **Corrección**: Reparación o rework para cumplir requisitos
    - **Concesión**: Autorización para usar "tal cual" con aceptación
    - **Rechazo**: Descarte, destrucción o devolución
    - **Prevención**: Acciones para evitar recurrencia

    ### Criterios para disposición
    - **Evaluación de riesgo**: Impacto en seguridad y calidad
    - **Requisitos regulatorios**: Cumplimiento legal aplicable
    - **Aceptación del cliente**: Cuando sea requerida
    - **Consideraciones económicas**: Costo-beneficio de acciones

    ## Acciones correctivas
    - **Análisis de causa raíz**: Identificar por qué ocurrió
    - **Acciones para evitar recurrencia**: Mejoras al proceso
    - **Verificación de efectividad**: Confirmar que acciones funcionan
    - **Documentación**: Registros completos de acciones tomadas

    ## Mejora del sistema
    - **Tendencia y análisis**: Identificar patrones recurrentes
    - **Acciones preventivas**: Address potential issues before they occur
    - **Revisión del proceso**: Mejora de controles existentes
    - **Training**: Capacitación para prevenir recurrencia`,
        16
      ],
      [
        "9.1", 
        "Seguimiento y medición", 
        "Plantilla para planificar el seguimiento, medición, análisis y evaluación",
        "./plantillas/iso9001/9.1_seguimiento_medicion.xlsx",
        `# Seguimiento, Medición, Análisis y Evaluación

    ## Planificación del monitoreo
    Determine qué necesita ser monitoreado y medido, los métodos para ello, cuándo debe realizarse y cuándo deben analizarse y evaluarse los resultados.

    ### Qué monitorear
    - **Desempeño de procesos**: Eficiencia y efectividad
    - **Conformidad de producto**: Cumplimiento de requisitos
    - **Satisfacción del cliente**: Percepción y feedback
    - **Desempeño de proveedores**: Calidad y entrega

    ### Métodos de medición
    - **Indicadores cuantitativos**: KPIs y métricas numéricas
    - **Indicadores cualitativos**: Encuestas y evaluaciones
    - **Observación directa**: Evaluación visual o auditiva
    - **Auditorías**: Evaluación sistemática contra criterios

    ## Análisis de datos
    ### Técnicas de análisis
    - **Análisis estadístico**: Tendencia, variación y capacidad
    - **Comparación contra objetivos**: Brechas y desempeño
    - **Benchmarking**: Comparación contra estándares externos
    - **Root cause analysis**: Identificación de causas profundas

    ### Evaluación de resultados
    - **Cumplimiento de objetivos**: Logro de metas establecidas
    - **Efectividad del SGC**: Contribución a resultados deseados
    - **Oportunidades de mejora**: Áreas que necesitan atención
    - **Necesidad de acciones**: Decisiones basadas en datos

    ## Toma de decisiones
    - **Basada en evidencia**: Decisiones apoyadas por datos
    - **Oportuna**: En el momento adecuado para máximo impacto
    - **Documentada**: Registro de decisiones y rationale
    - **Comunicada**: A las partes relevantes para implementación

    ## Mejora continua
    - **Feedback loop**: Aprendizaje de resultados de medición
    - **Ajuste de objetivos**: Basado en desempeño y cambios
    - **Optimización de métodos**: Mejora de técnicas de medición
    - **Innovación**: Nuevos approaches para monitoreo y análisis`,
        17
        ]
      ];
      
      plantillasData.forEach((item) => stmt.run(...item));
      stmt.finalize();
    }
  });
});

module.exports = db;

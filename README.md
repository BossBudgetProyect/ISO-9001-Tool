# ISO-9001-Tool

## Descripción
Herramienta para la gestión y documentación de procesos bajo la norma ISO 9001, con soporte para plantillas, carga de archivos y administración de usuarios.

## Arquitectura del Proyecto

El proyecto está estructurado en varias carpetas y archivos principales:

```
├── DatabaseJS/         # Scripts y utilidades para manipulación de la base de datos
├── ISOSystem.db        # Base de datos SQLite principal
├── db.js               # Conexión y lógica de base de datos
├── index.js            # Archivo principal de inicio de la aplicación 
├── middlewares/        # Middlewares de autenticación y administración
├── plantillas/         # Plantillas Excel para procesos ISO 9001
│   └── iso9001/        # Plantillas específicas para cada cláusula
├── routes/             # Definición de rutas de la API y vistas
├── uploads/            # Archivos subidos por los usuarios, organizados por usuario
├── views/              # Vistas EJS para la interfaz web
│   └── partials/       # Fragmentos reutilizables de vistas (header, footer)
├── package.json        # Dependencias y configuración del proyecto
```

### Detalle de Carpetas y Archivos

- **DatabaseJS/**: Scripts para eliminar, mapear y actualizar datos en la base de datos.
- **ISOSystem.db**: Base de datos SQLite donde se almacena toda la información.
- **db.js**: Lógica de conexión y operaciones sobre la base de datos.
- **index.js**: Punto de entrada de la aplicación Express (antes app.js).
- **middlewares/**: Middlewares personalizados para autenticación (`authMiddleware.js`) y administración (`adminMiddleware.js`).
- **plantillas/iso9001/**: Plantillas Excel para cada cláusula de la norma ISO 9001.
- **routes/**: Rutas de la aplicación, separadas por funcionalidad (autenticación, capacitación, implementación, ISO).
- **uploads/**: Carpeta donde se almacenan los archivos subidos por los usuarios, organizados por usuario.
- **views/**: Vistas EJS para renderizar la interfaz web, incluyendo formularios, checklists y páginas de error.
- **views/partials/**: Fragmentos de vistas reutilizables como encabezado y pie de página.
- **package.json**: Archivo de configuración de dependencias y scripts del proyecto.


## Instalación de dependencias

Instala todas las librerías necesarias con el siguiente comando en una sola línea:

```bash
npm install express ejs sqlite3 multer bcrypt connect-flash express-session
```

### Librerías principales utilizadas

- express
- ejs
- sqlite3
- multer
- bcrypt
- connect-flash
- express-session

## Inicio del proyecto

Para iniciar la aplicación, ejecuta:

```bash
node index.js
```

La aplicación se iniciará usando el archivo `index.js` como punto de entrada.
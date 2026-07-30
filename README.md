# StopOver-App

**Nombre del proyecto:** StopOver

Aplicación web full stack para planear viajes por carretera: el usuario define un origen y destino, y la app sugiere paradas (cafeterías, miradores, gasolineras, restaurantes) a lo largo de la ruta, según sus preferencias.

**Integrantes:**
1. Oscar Zuriel García Ortega
2. Emmanuel Abisai Ambrocio Garcia

**Problemática que resuelve:** 
Los viajeros de rutas largas a menudo desconocen los mejores lugares seguros y atractivos para hacer escalas (cafeterías, miradores, pueblos mágicos), ocasionando fatiga y pérdida de oportunidades turísticas. Al mismo tiempo, los negocios locales en estas carreteras carecen de visibilidad directa ante los conductores. StopOver permite gestionar y visualizar puntos de escala óptimos, conectando las rutas de los viajeros con los establecimientos locales.


## Tecnologías utilizadas

- **Backend:** Java 21, Spring Boot, Spring Security + JWT, Spring Data JPA, Hibernate
- **Base de datos:** MySQL 8.4, Flyway (migraciones versionadas)
- **Frontend:** React + Vite
- **Comunicación:** Postfix + JavaMailSender (correo), Twilio (SMS y WhatsApp)
- **Infraestructura:** VPS (AWS EC2), Nginx (reverse proxy), Let's Encrypt / Certbot (HTTPS)
- **Pruebas de API:** Bruno
- **Control de versiones:** Git / GitHub, GitHub Projects

## Enlaces del proyecto

- **Sitio desplegado (HTTPS):** https://stopover-app.lat
- **URL base de la API:** https://stopover-app.lat/api
- **Prototipo de Figma:**https://www.figma.com/design/fE1X6nT8VaJHfgHgFsRWyC/StopOver---Mockup?node-id=0-1&t=MutAk7gtp9dQd4l5-0
- **Tablero de GitHub Projects:** https://github.com/users/OscarZurielGarciaOrtega/projects/6/views/1

![alt text](img/image.png)

---

# Backend

## Diagrama Entidad-Relación

![alt text](img/Untitled.png)

Resumen de tablas principales:

- **roles** — ADMIN, VIAJERO, PROPIETARIO
- **usuarios** — datos de cuenta, relacionados a un rol
- **rutas** — viajes creados por un usuario (origen, destino, fecha)
- **paradas** — puntos de interés (cafeterías, miradores, gasolineras, restaurantes)
- **ruta_parada** — tabla intermedia de la relación N:M entre rutas y paradas
- **favoritos** — rutas marcadas como favoritas por un usuario
- **historial** — registro de consultas de rutas por usuario
- **negocios** — comercios registrados por propietarios, con flujo de moderación (PENDIENTE / APROBADO / RECHAZADO)

## Credenciales de prueba

| Rol | Email | Contraseña |
|---|---|---|
| Administrador (evaluación) | admin@stopover.com | Admin123! |
| Viajero | ana.garcia@stopover.com | Usuario123! |
| Propietario | paola.sanchez@stopover.com | Propietario123! |

## Instalación y ejecución local del backend

### Requisitos previos
- Java 21
- Maven (incluido vía `mvnw`)
- MySQL 8.x 

### Pasos

1. Clona el repositorio:
```bash
   git clone https://github.com/OscarZurielGarciaOrtega/StopOver-App.git
   cd StopOver-App/backend
```

2. Copia el archivo de configuración de ejemplo y complétalo con tus propios valores:
```bash
   cp src/main/resources/application.properties.example src/main/resources/application.properties
```

3. Edita `application.properties` con los datos reales de tu base de datos, tu clave JWT, y tus credenciales de Twilio.

4. Crea la base de datos en MySQL:
```sql
   CREATE DATABASE stopover_db CHARACTER SET utf8mb4;
```

5. Ejecuta la aplicación (Flyway aplica automáticamente todas las migraciones y siembra los datos de prueba):
```bash
   ./mvnw spring-boot:run
```

6. El backend queda disponible en `http://localhost:8080`.

## Documentación de la API — endpoints principales

URL base: `https://stopover-app.lat/api` (o `http://localhost:8080/api` en local)

### Autenticación (públicos)
- `POST /api/auth/login` → `{ email, password }`
- `POST /api/auth/registro` → `{ nombre, email, telefono, password }`
- `POST /api/auth/recuperar-password` → `{ email }` (envía código por SMS)
- `POST /api/auth/reset-password` → `{ email, codigo, nuevaPassword }`

Todas las respuestas de login/registro incluyen un token JWT que debe enviarse en cada petición protegida:

### Rutas (requieren autenticación)
- `POST /api/rutas` → crea una ruta con sus paradas (`paradaIds: [1,2,3]`)
- `GET /api/rutas?page=0&size=10` → rutas del usuario autenticado, paginado
- `GET /api/rutas/{id}` → detalle de una ruta con sus paradas
- `PUT /api/rutas/{id}` → actualiza una ruta
- `DELETE /api/rutas/{id}` → elimina una ruta

### Paradas (requieren autenticación)
- `GET /api/paradas?page=0&size=10&tipo=CAFETERIA` → listado paginado con filtro opcional
- `GET /api/paradas/recomendaciones?tipo=CAFETERIA&destino=oaxaca` → recomendación combinada

### Usuarios (requiere rol ADMIN)
- `GET /api/usuarios` → listado paginado de usuarios

### Negocios (moderación)
- `POST /api/negocios/registrar` (rol PROPIETARIO) → registra un negocio (queda en estatus PENDIENTE)
- `GET /api/admin/negocios/pendientes` (rol ADMIN)
- `PUT /api/admin/negocios/{id}/aprobar` (rol ADMIN)
- `PUT /api/admin/negocios/{id}/rechazar` (rol ADMIN)
- `GET /api/negocios/aprobados` → negocios visibles en el mapa
- `GET /api/negocios/cercanos?lat=X&lng=Y&radioKm=10&categoria=CAFETERIA` → búsqueda por cercanía real (fórmula de Haversine)
- `POST /api/negocios/{negocioId}/agregar-a-ruta/{rutaId}` → convierte un negocio aprobado en parada de una ruta

### Notificaciones
- `POST /api/notificaciones/sms-prueba?numero=+52...`
- `POST /api/notificaciones/whatsapp-prueba?numero=+52...`

### Formato estándar de errores

Todas las respuestas de error siguen esta estructura, con el código HTTP correspondiente (400, 401, 403, 404, 500):
```json
{
  "status": 400,
  "error": "Datos inválidos",
  "mensajes": ["mensaje específico 1", "mensaje específico 2"],
  "timestamp": "2026-07-29T12:00:00"
}
```

## Pruebas de API con Bruno

La colección de Bruno está versionada en la carpeta [`/bruno`](./bruno) de este repositorio, e incluye:
- Login y obtención del token JWT
- Uso del token en peticiones protegidas (rutas, paradas, usuarios, negocios)
- Casos de error (credenciales inválidas, acceso denegado por rol, recurso no encontrado)

![alt text](img/image-1.png)
![alt text](img/image-2.png)
![alt text](img/image-3.png)

## Despliegue en VPS

- Backend ejecutado como `.jar` en el VPS
- Nginx como reverse proxy hacia el backend (puerto 9000 interno)
- Certificado SSL gratuito con Let's Encrypt / Certbot sobre el dominio `stopover-app.lat`
- Correo saliente configurado con Postfix (SPF y DKIM publicados en el DNS del dominio)

---

# Frontend

## Arquitectura y Tecnologías del Cliente
* La interfaz está desarrollada con **React** utilizando **Vite** para un empaquetado ultra rápido y un rendimiento optimizado en tiempo de desarrollo y producción.
* Se implementó un diseño responsivo adaptado tanto para dispositivos móviles como para equipos de escritorio.
* Se hace uso de **Axios** para el consumo de la API REST, integrando de forma automática el token JWT en el header `Authorization` de cada petición protegida.
* Manejo de estados de carga (Loading states) visibles durante las peticiones asíncronas a la API para mejorar la experiencia del usuario.

## Instrucciones de Instalación y Ejecución Local

### Requisitos Previos
* Node.js (versión 18 o superior recomendada)
* npm (gestor de paquetes de Node)

### Pasos Detallados

1. Abre tu terminal de comandos, clona el repositorio oficial de GitHub del proyecto y desplázate al directorio del frontend ejecutando:
   git clone https://github.com/OscarZurielGarciaOrtega/StopOver-App.git
   cd StopOver-App/frontend

2. Instala todas las dependencias y librerías necesarias del proyecto escribiendo en tu terminal:
   npm install

3. Configura las variables de entorno creando un archivo con el nombre exacto de `.env` ubicado directamente en la raíz de la carpeta del frontend, e incluye la ruta base de comunicación hacia tu servidor backend:
   VITE_API_URL=http://localhost:8080/api

4. Inicia el servidor de desarrollo local ejecutando el siguiente comando:
   npm run dev

5. Abre tu navegador web de preferencia y accede a la dirección local que la terminal te proporcione, la cual habitualmente es http://localhost:5173.

---

## Pantallas Principales de la Aplicación y Experiencia de Usuario

### 1. Pantalla de Inicio de Sesión y Recuperación de Contraseña
* Cuenta con un sistema de autenticación por roles (Administrador, Viajero y Propietario).
* Incluye validaciones estrictas debajo de cada campo de entrada en tiempo real, evitando uso de alertas nativas del navegador.
* Contempla el flujo completo de recuperación y restablecimiento de contraseña mediante códigos numéricos enviados al correo electrónico del usuario.
![Login y Recuperación](img/login.png)

### 2. Mapa Interactivo del Viajero / Dashboard y Búsqueda
* Interfaz principal donde los usuarios planifican sus trayectos ingresando origen y destino.
* Sistema de **búsqueda avanzada y filtrado** de paradas (cafeterías, miradores, gasolineras, restaurantes) y establecimientos cercanos aplicando la fórmula de Haversine.
* Paginación real del lado del servidor para el manejo eficiente de grandes volúmenes de datos en tablas y listados.
![Dashboard Mapa](img/dashboard.png)

### 3. Gestión de Favoritos e Historial de Viajes
* Módulo interactivo para que los usuarios marquen y consulten sus rutas preferidas de forma rápida.
* Sección de **historial** que almacena cronológicamente todas las consultas y trayectos generados previamente por el usuario autenticado.
![Favoritos e Historial](img/historial.png)

### 4. Panel de Administración y Moderación
* Módulo exclusivo para usuarios con rol de Administrador.
* Permite visualizar el catálogo general de paradas y ejecutar el flujo de moderación (aprobar o rechazar mediante modales de confirmación) para los nuevos negocios dados de alta por los propietarios, además de la gestión global de usuarios.
![Admin Panel](img/admin.png)

### 5. Vista de Negocios y Registro de Establecimientos
* Interfaz orientada al rol de Propietario para registrar comercios y establecimientos locales.
* Envía los datos con estatus inicial pendiente de moderación para su posterior revisión y autorización en el panel de administrador.
![Mi Negocio](img/negocio.png)

### 6. Módulo de Ajustes de Cuenta y Perfil
* Pantalla de configuración donde el usuario visualiza su información personal y de perfil (nombre, correo, avatar y rol asignado).
* Permite la administración de preferencias generales de la cuenta dentro de la aplicación.
![Ajustes](img/ajustes.png)
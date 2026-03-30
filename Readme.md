#  Task Management API

API REST desarrollada con **Node.js, Express y TypeScript** para la gestión de tareas con autenticación basada en JWT.

---

##  Descripción del Proyecto

Este proyecto consiste en una API que permite a los usuarios:

* Registrarse e iniciar sesión de forma segura
* Gestionar sus propias tareas (CRUD)
* Proteger rutas mediante autenticación con JWT
* Validar datos de entrada
* Documentar endpoints con Swagger
* Mantener buenas prácticas con TypeScript, JSDoc y Conventional Commits

Cada usuario solo puede acceder a sus propias tareas, garantizando seguridad en entornos multiusuario.

---

##  Arquitectura del Proyecto

El proyecto sigue una estructura modular y escalable:

```
src/
│
├── api/
│   ├── middlewares/      # Validación y autenticación (JWT)
│   └── routes/           # Definición de rutas (auth, tasks)
│
├── config/               # Configuración general
├── controllers/          # Lógica de negocio (auth, tasks)
├── persistence/          # Conexión a base de datos (PostgreSQL)
├── schemas/              # Validación con AJV (JSON Schema)
├── services/             # Lógica reutilizable (auth, hashing)
├── utils/                # Utilidades (JWT, helpers)
│
├── app.ts                # Configuración de Express
└── server.ts             # Punto de entrada
──test                    # Pruebas unitarias
```

---

## Autenticación y Autorización

### Registro

* **POST /auth/register**
* Crea un usuario con:

  * nombre
  * email
  * contraseña (hasheada con bcrypt)

### Login

* **POST /auth/login**
* Verifica credenciales
* Retorna un **JWT**

### Protección de rutas

* Middleware que valida:

```
Authorization: Bearer <token>
```

* Si el token es válido, permite acceso a rutas protegidas

---

## Gestión de Tareas (CRUD)

Cada tarea contiene:

* `id`
* `titulo`
* `descripcion`
* `fecha_vencimiento`
* `estado` ('pendiente', 'en curso', 'completada')
* `usuario_id`

### Endpoints:

* **POST /tasks** → Crear tarea
* **GET /tasks** → Listar tareas del usuario
* **GET /tasks/:id** → Obtener tarea específica
* **PUT /tasks/:id** → Actualizar tarea
* **DELETE /tasks/:id** → Eliminar tarea

Todas las rutas están protegidas y solo el dueño puede acceder.

---

##  Validación y Manejo de Errores

### Validación

* Implementada con **AJV + JSON Schema**
* Se validan inputs como:

  * Email válido
  * Campos requeridos
  * Tipos de datos

### Manejo de errores

* Respuestas claras y consistentes en formato JSON
* Control de errores de base de datos
* Manejo de casos como:

  * Usuario no encontrado
  * Email duplicado
  * Acceso no autorizado

---

##  Documentación

* **Swagger** → Documentación de endpoints
* **JSDoc** → Documentación interna del código
* **Vitest** → Pruebas unitarias

---

##  Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone <tu-repo>
cd task-management-api
```

---

### 2. Instalar dependencias

```bash
npm install
```

---

### 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```
PORT=3000
DB_HOST=localhost
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=bd_task
JWT_SECRET=supers
```

---

### 4. Ejecutar el proyecto

#### Modo desarrollo

```bash
npm run dev
```

#### Build producción

```bash
npm run build
npm start
```

---

##  Testing

Ejecutar pruebas:

```bash
npm run test
```

Modo watch:

```bash
npm run test:watch
```

---

## Scripts disponibles

```json
"scripts": {
  "build": "tsc",
  "start": "node dist/server.js",
  "dev": "ts-node-dev src/server.ts",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

---

##  Tecnologías utilizadas

* Node.js
* Express
* TypeScript
* PostgreSQL
* JWT (jsonwebtoken)
* bcrypt
* AJV (validación)
* Swagger
* Vitest

---

##  Buenas prácticas aplicadas

* Arquitectura modular
* Separación de responsabilidades
* Validación de datos
* Autenticación segura
* Documentación (Swagger + JSDoc)
* Conventional Commits

---

##  Autor

Desarrollado por **Nicholas Hurtado** 

# EduBot - Sistema de Gestión de Acuerdos con IA

EduBot es una aplicación web para la gestión de acuerdos institucionales que utiliza inteligencia artificial para procesar y estructurar información de manera automática. El sistema permite consultar acuerdos existentes mediante lenguaje natural y crear nuevos acuerdos a partir de texto libre.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Compilación y Ejecución](#compilación-y-ejecución)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Scripts Disponibles](#scripts-disponibles)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)

## ✨ Características

- **Chat de Consulta**: Consulta acuerdos existentes usando lenguaje natural
- **Creación de Acuerdos**: Crea nuevos acuerdos estructurados a partir de texto libre
- **Interfaz Responsive**: Diseño optimizado para desktop, tablet y móviles
- **Procesamiento con IA**: Utiliza LLM (Ollama) para procesar y estructurar información
- **Base de Datos MongoDB**: Almacenamiento persistente de acuerdos

## 🛠 Tecnologías

### Frontend
- **React 19.2.0**: Framework de UI
- **React Router DOM 7.13.0**: Navegación entre páginas
- **Vite 7.2.4**: Build tool y dev server
- **React Icons 5.5.0**: Iconografía
- **CSS3**: Estilos con variables CSS y diseño responsive

### Backend
- **Node.js**: Runtime de JavaScript
- **Express.js**: Framework web (asumido)
- **Mongoose**: ODM para MongoDB
- **Ollama**: LLM local para procesamiento de texto
- **CORS**: Manejo de políticas de origen cruzado

### Base de Datos
- **MongoDB**: Base de datos NoSQL

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior)
- **npm** o **yarn** (gestor de paquetes)
- **MongoDB** (local o remoto)
- **Ollama** (para el modelo LLM)
  - Instalar desde: https://ollama.ai
  - Modelo requerido: `gemma3` (o el modelo configurado en el backend)

## 🚀 Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Kilichi/EduBot.git
cd EduBot
```

### 2. Instalar Dependencias del Backend

```bash
cd backend
npm install
```

### 3. Instalar Dependencias del Frontend

```bash
cd ../frontend
npm install
```

## ⚙️ Configuración

### Backend

1. **Configurar Variables de Entorno**

   Crea un archivo `.env` en la carpeta `backend/` con las siguientes variables:

   ```env
   PORT=3300
   MONGODB_URI=mongodb://localhost:27017/edubot
   OLLAMA_URL=http://localhost:11434
   OLLAMA_MODEL=gemma3
   NODE_ENV=development
   ```

2. **Configurar MongoDB**

   - Asegúrate de que MongoDB esté corriendo
   - La URI de conexión debe apuntar a tu instancia de MongoDB
   - La base de datos se creará automáticamente si no existe

3. **Configurar Ollama**

   - Inicia el servicio de Ollama
   - Descarga el modelo necesario:
     ```bash
     ollama pull gemma3
     ```

### Frontend

1. **Configurar URL del Backend**

   El frontend está configurado para conectarse a `http://localhost:3300/api` por defecto.

   Si necesitas cambiar la URL del backend, edita el archivo:
   ```
   frontend/src/services/api.js
   ```

   Cambia la constante `API_BASE_URL`:
   ```javascript
   const API_BASE_URL = 'http://localhost:3300/api';
   ```

## 🏗 Compilación y Ejecución

### Desarrollo

#### 1. Iniciar el Backend

```bash
cd backend
npm start
# O si tienes un script de desarrollo:
npm run dev
```

El backend estará disponible en: `http://localhost:3300`

#### 2. Iniciar el Frontend

En una nueva terminal:

```bash
cd frontend
npm run dev
```

El frontend estará disponible en: `http://localhost:5173` (puerto por defecto de Vite)

### Producción

#### 1. Compilar el Frontend

```bash
cd frontend
npm run build
```

Esto generará una carpeta `dist/` con los archivos optimizados para producción.

#### 2. Previsualizar la Build de Producción

```bash
cd frontend
npm run preview
```

#### 3. Desplegar el Backend

Asegúrate de configurar las variables de entorno en producción y ejecutar:

```bash
cd backend
npm start
```

## 📁 Estructura del Proyecto

```
EduBot/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuración (DB, env)
│   │   ├── controllers/     # Controladores de rutas
│   │   ├── models/          # Modelos de Mongoose
│   │   ├── routes/          # Definición de rutas
│   │   ├── services/        # Servicios (LLM, context builder)
│   │   ├── utils/           # Utilidades
│   │   ├── validators/      # Validadores
│   │   └── index.js         # Punto de entrada
│   ├── package.json
│   └── .env                 # Variables de entorno (crear)
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   │   ├── AgreementDisplay/
│   │   │   ├── AgreementPreview/
│   │   │   ├── Chat/
│   │   │   └── Layout/
│   │   ├── pages/           # Páginas principales
│   │   │   ├── Dashboard/
│   │   │   ├── CreateAgreement/
│   │   │   └── Login/
│   │   ├── services/        # Servicios API
│   │   ├── utils/           # Utilidades
│   │   ├── App.jsx          # Componente principal
│   │   └── main.jsx         # Punto de entrada
│   ├── public/              # Archivos estáticos
│   ├── package.json
│   └── vite.config.js       # Configuración de Vite
│
└── README.md
```

## 📜 Scripts Disponibles

### Backend

```bash
npm test          # Ejecutar tests (si están configurados)
npm start          # Iniciar servidor en producción
```

### Frontend

```bash
npm run dev        # Iniciar servidor de desarrollo
npm run build      # Compilar para producción
npm run preview    # Previsualizar build de producción
npm run lint       # Ejecutar linter
```

## 🔌 API Endpoints

### POST `/api/chat/consulta`
Consulta acuerdos usando lenguaje natural.

**Request:**
```json
{
  "prompt": "¿Cuáles son los últimos acuerdos?"
}
```

**Response:**
```json
{
  "respuesta": "He encontrado 2 acuerdos: ..."
}
```

### POST `/api/chat/registro/preview`
Previsualiza un acuerdo estructurado a partir de texto libre.

**Request:**
```json
{
  "text": "En la reunión del claustro se acordó..."
}
```

**Response:**
```json
{
  "fecha": "26/10/2023",
  "titulo": "Título del acuerdo",
  "descripcion": "Descripción detallada",
  "origen": "Claustro",
  "etiquetas": ["tag1", "tag2"]
}
```

### POST `/api/chat/registro/confirm`
Guarda un acuerdo en la base de datos.

**Request:**
```json
{
  "fecha": "26/10/2023",
  "titulo": "Título del acuerdo",
  "descripcion": "Descripción detallada",
  "origen": "Claustro",
  "etiquetas": ["tag1", "tag2"]
}
```

**Response:**
```json
{
  "message": "Acuerdo registrado con éxito",
  "data": { ... }
}
```

## 🐛 Troubleshooting

### El frontend no se conecta al backend

1. Verifica que el backend esté corriendo en el puerto 3300
2. Revisa la URL en `frontend/src/services/api.js`
3. Asegúrate de que CORS esté configurado correctamente en el backend

### Error de conexión a MongoDB

1. Verifica que MongoDB esté corriendo:
   ```bash
   mongosh
   ```
2. Revisa la URI de conexión en el archivo `.env`
3. Asegúrate de que la base de datos sea accesible

### Error con Ollama

1. Verifica que Ollama esté corriendo:
   ```bash
   ollama list
   ```
2. Asegúrate de que el modelo esté descargado:
   ```bash
   ollama pull gemma3
   ```
3. Revisa la URL de Ollama en la configuración del backend

### Problemas de compilación

1. Limpia los `node_modules` y reinstala:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
2. Verifica que tengas la versión correcta de Node.js
3. Revisa los logs de error para más detalles

### Problemas en móviles

- La aplicación está optimizada para móviles
- Asegúrate de usar un viewport meta tag correcto
- Verifica que los estilos responsive estén aplicados

## 📝 Notas Adicionales

- El proyecto utiliza la fuente **Montserrat** para toda la aplicación
- Los colores principales están definidos en `frontend/src/index.css` como variables CSS
- El diseño es completamente responsive y optimizado para móviles
- El backend utiliza Ollama para procesamiento de lenguaje natural

## 🔮 Próximas Características

Según `FUTURE_PLANS.MD`:
- Sistema de login
- Grabación de voz
- Sistema de registro
- Subida de archivos y lectura con LLM

## 📄 Licencia

ISC

## 👥 Autores

- Jose Poveda
- IES Hermanos Amoros

---

Para más información o soporte, consulta los issues del repositorio o contacta al equipo de desarrollo.

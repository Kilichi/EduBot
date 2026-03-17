# EduBot

Asistente educativo con IA para la gestión de acuerdos académicos. Construido con **Next.js**, **React**, **TypeScript** y **MongoDB**.

Desarrollado por **Jose Poveda Sabater** y **Vive Coding**.

---

## Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- Una cuenta en [Groq](https://console.groq.com/) (API de LLM)
- Una cuenta en [MongoDB Atlas](https://www.mongodb.com/atlas) (base de datos)

---

## 1. Obtener la API Key de Groq (modelo LLM)

Groq proporciona acceso gratuito a modelos de lenguaje como **Llama 3.3 70B**.

1. Ve a [console.groq.com](https://console.groq.com/) y crea una cuenta (puedes iniciar sesión con Google o GitHub).
2. Una vez dentro, en el menú lateral haz clic en **"API Keys"**.
3. Haz clic en **"Create API Key"**.
4. Ponle un nombre (por ejemplo, `edubot`) y haz clic en **"Submit"**.
5. **Copia la clave generada** y guárdala en un lugar seguro. Solo se muestra una vez.

> Esa clave es la que usarás como valor de `GROQ_API_KEY` en las variables de entorno.

---

## 2. Obtener el URI de MongoDB Atlas

MongoDB Atlas ofrece un tier gratuito (M0) con 512 MB de almacenamiento.

### Crear una cuenta y un cluster

1. Ve a [mongodb.com/atlas](https://www.mongodb.com/atlas) y crea una cuenta.
2. Haz clic en **"Build a Database"**.
3. Selecciona el plan **M0 (Free)** y la región que prefieras.
4. Haz clic en **"Create Deployment"**.

### Configurar acceso

5. En la sección **"Database Access"**, crea un usuario:
   - Haz clic en **"Add New Database User"**.
   - Elige un nombre de usuario y contraseña.
   - En permisos selecciona **"Read and write to any database"**.
   - Haz clic en **"Add User"**.

6. En la sección **"Network Access"**, permite conexiones:
   - Haz clic en **"Add IP Address"**.
   - Para desarrollo local puedes añadir tu IP actual con **"Add Current IP Address"**.
   - Para despliegue en Vercel u otros servicios serverless, añade `0.0.0.0/0` (permite todas las IPs).

### Obtener el string de conexión

7. Ve a **"Database"** en el menú lateral y haz clic en **"Connect"** en tu cluster.
8. Selecciona **"Drivers"**.
9. Copia el URI que aparece. Tiene este formato:

```
mongodb+srv://<usuario>:<contraseña>@cluster0.xxxxx.mongodb.net/?appName=Cluster0
```

10. Reemplaza `<usuario>` y `<contraseña>` por los que creaste en el paso 5.

> Ese URI es el que usarás como valor de `MONGODB_URI` en las variables de entorno.

---

## 3. Despliegue local

### Clonar el repositorio

```bash
git clone https://github.com/Kilichi/EduBot.git
cd EduBot/web
```

### Instalar dependencias

```bash
npm install
```

### Configurar variables de entorno

Crea un archivo `.env.local` dentro de la carpeta `web/` basándote en el ejemplo:

```bash
cp .env.local.example .env.local
```

Abre `.env.local` y rellena los valores:

```env
MONGODB_URI=mongodb+srv://<usuario>:<contraseña>@cluster0.xxxxx.mongodb.net/?appName=Cluster0
JWT_SECRET=una_cadena_secreta_larga_y_aleatoria
GROQ_API_KEY=gsk_tu_clave_de_groq_aqui
GROQ_MODEL=llama-3.3-70b-versatile
```

| Variable | Descripción |
|---|---|
| `MONGODB_URI` | URI de conexión a MongoDB Atlas (ver sección 2) |
| `JWT_SECRET` | Clave secreta para firmar los tokens JWT. Usa una cadena larga y aleatoria |
| `GROQ_API_KEY` | Clave de API de Groq (ver sección 1) |
| `GROQ_MODEL` | Modelo a utilizar. Por defecto `llama-3.3-70b-versatile` |

### Iniciar en modo desarrollo

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

### Build de producción (opcional)

```bash
npm run build
npm start
```

---

## 4. Despliegue en Vercel

### Conectar el repositorio

1. Ve a [vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub.
2. Haz clic en **"Add New..." → "Project"**.
3. Selecciona el repositorio **EduBot**.
4. Configura el proyecto:
   - **Root Directory**: `web`
   - **Framework Preset**: Next.js (se detecta automáticamente)
   - **Build Command**: dejar por defecto
   - **Output Directory**: dejar por defecto

### Configurar variables de entorno

5. En la sección **"Environment Variables"** del proyecto en Vercel, añade las mismas 4 variables:

| Variable | Valor |
|---|---|
| `MONGODB_URI` | Tu URI de MongoDB Atlas |
| `JWT_SECRET` | La misma clave secreta que usas en local |
| `GROQ_API_KEY` | Tu clave de API de Groq |
| `GROQ_MODEL` | `llama-3.3-70b-versatile` |

6. Haz clic en **"Deploy"**.

### Actualizar el despliegue

Cada vez que hagas `git push` a la rama `main`, Vercel re-despliega automáticamente. Si necesitas forzar un redespliegue manual:

1. Ve al dashboard de tu proyecto en [vercel.com](https://vercel.com).
2. Haz clic en la pestaña **"Deployments"**.
3. En el despliegue más reciente, haz clic en los **tres puntos (⋮)** → **"Redeploy"**.

### Importante: acceso de red en MongoDB Atlas

Las funciones serverless de Vercel usan IPs dinámicas. Para que puedan conectar a tu base de datos, en MongoDB Atlas ve a **Network Access** y añade la IP `0.0.0.0/0` (acceso desde cualquier lugar).

---

## Estructura del proyecto

```
EduBot/
└── web/                        # Aplicación Next.js
    ├── src/
    │   ├── app/                # Páginas y API routes (App Router)
    │   │   ├── api/            # Endpoints del backend
    │   │   │   ├── auth/       # Login, registro, logout, estado
    │   │   │   └── chat/       # Consulta y creación de acuerdos
    │   │   ├── dashboard/      # Página principal (consultas)
    │   │   ├── create-agreement/ # Creación de acuerdos
    │   │   ├── login/          # Inicio de sesión
    │   │   └── registro/       # Registro de usuarios
    │   ├── components/         # Componentes reutilizables
    │   ├── contexts/           # AuthContext
    │   ├── lib/                # Utilidades (auth, DB, LLM, validación)
    │   └── models/             # Esquemas de Mongoose
    ├── .env.local.example      # Plantilla de variables de entorno
    └── package.json
```

---

## Autor

Proyecto desarrollado por **Jose Poveda** con **Vive Coding**.

© 2026 — IES Hermanos Amorós · EduBot 1.0

# 🚀 Guía de Despliegue en Vercel

Esta guía te ayudará a desplegar tu aplicación EduBot en Vercel.

## 📋 Requisitos Previos

1. Cuenta en [Vercel](https://vercel.com)
2. Cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (recomendado) o MongoDB local
3. Credenciales de Google OAuth configuradas
4. Git repository con tu código

## 🔧 Configuración Paso a Paso

### 1. Preparar el Repositorio

Asegúrate de que tu código esté en un repositorio Git:

```bash
git init
git add .
git commit -m "Preparado para Vercel"
git remote add origin <tu-repositorio>
git push -u origin main
```

### 2. Crear Proyecto en Vercel

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Haz clic en **"Add New Project"**
3. Conecta tu repositorio de Git
4. Vercel detectará automáticamente la configuración

### 3. Configurar Variables de Entorno

En el dashboard de Vercel, ve a **Settings > Environment Variables** y agrega:

#### Variables del Backend:

```env
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/edubot?retryWrites=true&w=majority
SESSION_SECRET=tu-secret-key-super-segura-y-larga-para-produccion
GOOGLE_CLIENT_ID=562111747832-3mtve3q1facdkcrpcqg1mqibhhhams8a.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
API_GROK=tu-api-key-de-grok
NODE_ENV=production
```

#### Variables del Frontend (opcional):

```env
VITE_API_BASE_URL=https://tu-proyecto.vercel.app/api
```

**Nota**: Si no defines `VITE_API_BASE_URL`, el frontend usará rutas relativas (`/api`) que funcionarán automáticamente con Vercel.

### 4. Configurar Google OAuth para Producción

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Selecciona tu proyecto
3. Ve a **APIs y servicios > Credenciales**
4. Edita tu cliente OAuth 2.0
5. En **"URI de redirección autorizados"**, agrega:
   ```
   https://tu-proyecto.vercel.app/api/auth/google/callback
   ```
6. En **"Orígenes JavaScript autorizados"**, agrega:
   ```
   https://tu-proyecto.vercel.app
   ```
7. Guarda los cambios

### 5. Configurar MongoDB Atlas (Recomendado)

Si usas MongoDB Atlas:

1. Crea un cluster en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea un usuario de base de datos
3. Configura el acceso de red (permite `0.0.0.0/0` para Vercel)
4. Obtén la cadena de conexión (Connection String)
5. Agrega la cadena de conexión como `MONGODB_URI` en Vercel

### 6. Desplegar

1. En Vercel, haz clic en **"Deploy"**
2. Espera a que termine el build
3. Una vez desplegado, obtendrás una URL como: `https://tu-proyecto.vercel.app`

### 7. Verificar el Despliegue

1. Visita `https://tu-proyecto.vercel.app/api/health`
   - Deberías ver: `{"status":"ok","message":"Servidor funcionando correctamente",...}`

2. Visita `https://tu-proyecto.vercel.app`
   - Deberías ver la página de login

3. Prueba el login con Google
   - Deberías poder autenticarte correctamente

## 🔍 Solución de Problemas

### Error: "Cannot find module"

**Solución**: Asegúrate de que todas las dependencias estén en `package.json` y que el build se complete correctamente.

### Error: "MongoDB connection failed"

**Solución**: 
- Verifica que `MONGODB_URI` esté correctamente configurada
- Asegúrate de que MongoDB Atlas permita conexiones desde `0.0.0.0/0`
- Verifica que el usuario de la base de datos tenga permisos correctos

### Error: "OAuth callback mismatch"

**Solución**:
- Verifica que el callback URL en Google Cloud Console coincida exactamente con:
  ```
  https://tu-proyecto.vercel.app/api/auth/google/callback
  ```
- Asegúrate de que no haya espacios o caracteres extra

### Error: CORS

**Solución**:
- Verifica que `FRONTEND_URL` en Vercel esté configurada correctamente
- O deja que Vercel use `VERCEL_URL` automáticamente (ya configurado)

### Las cookies no funcionan

**Solución**:
- Verifica que `secure: true` esté configurado en producción (ya configurado)
- Asegúrate de que `sameSite` esté configurado correctamente
- Verifica que el dominio del frontend y backend sean el mismo en Vercel

## 📝 Notas Importantes

1. **URLs Dinámicas**: El código está configurado para usar `VERCEL_URL` automáticamente, así que no necesitas configurar `API_BASE_URL` manualmente a menos que uses un dominio personalizado.

2. **Sesiones**: Las sesiones se almacenan en MongoDB usando `connect-mongo`, así que necesitas MongoDB funcionando.

3. **Build Commands**: Vercel detectará automáticamente:
   - Frontend: `npm run build` en la carpeta `frontend`
   - Backend: Serverless function en `api/index.js`

4. **Dominio Personalizado**: Si usas un dominio personalizado, actualiza:
   - Las variables de entorno en Vercel
   - Los callback URLs en Google Cloud Console

## 🎉 ¡Listo!

Una vez completados estos pasos, tu aplicación debería estar funcionando en Vercel. Si encuentras algún problema, revisa los logs en el dashboard de Vercel.

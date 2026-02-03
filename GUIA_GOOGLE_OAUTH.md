# Guía: Cómo Obtener las Credenciales de Google OAuth

Esta guía te ayudará a obtener el **Client ID** y **Client Secret** necesarios para configurar el login con Google en EduBot.

## 📋 Pasos para Obtener las Credenciales

### Paso 1: Acceder a Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Inicia sesión con tu cuenta de Google

### Paso 2: Crear un Nuevo Proyecto (o Seleccionar uno Existente)

1. En la parte superior, haz clic en el selector de proyectos
2. Haz clic en **"Nuevo Proyecto"** (o selecciona uno existente)
3. Ingresa un nombre para el proyecto (ej: "EduBot")
4. Haz clic en **"Crear"**
5. Espera a que se cree el proyecto y selecciónalo

### Paso 3: Habilitar la API de Google+

1. En el menú lateral, ve a **"APIs y servicios"** > **"Biblioteca"**
2. Busca **"Google+ API"** o **"Google Identity"**
3. Haz clic en **"Habilitar"** (si no está habilitada)
   - Nota: Google+ API está deprecada, pero aún funciona. Alternativamente, puedes usar **"Google Identity Services"**

### Paso 4: Configurar la Pantalla de Consentimiento OAuth

1. Ve a **"APIs y servicios"** > **"Pantalla de consentimiento OAuth"**
2. Selecciona **"Externo"** (a menos que tengas una cuenta de Google Workspace)
3. Haz clic en **"Crear"**
4. Completa el formulario:
   - **Nombre de la aplicación**: EduBot (o el nombre que prefieras)
   - **Correo electrónico de soporte**: Tu email
   - **Logo de la aplicación**: (Opcional)
   - **Dominio autorizado**: (Opcional, para producción)
   - **Correo electrónico del desarrollador**: Tu email
5. Haz clic en **"Guardar y continuar"**
6. En **"Ámbitos"**, haz clic en **"Guardar y continuar"** (usaremos los ámbitos por defecto)
7. En **"Usuarios de prueba"**, puedes agregar tu email si quieres probar antes de publicar
8. Haz clic en **"Guardar y continuar"**
9. Revisa el resumen y haz clic en **"Volver al panel"**

### Paso 5: Crear las Credenciales OAuth 2.0

1. Ve a **"APIs y servicios"** > **"Credenciales"**
2. Haz clic en **"+ CREAR CREDENCIALES"** en la parte superior
3. Selecciona **"ID de cliente OAuth 2.0"**

### Paso 6: Configurar el ID de Cliente OAuth

1. En **"Tipo de aplicación"**, selecciona **"Aplicación web"**
2. Ingresa un **nombre** para tu cliente (ej: "EduBot Web Client")
3. En **"URI de redirección autorizados"**, haz clic en **"+ AGREGAR URI"**
4. Agrega la siguiente URL (para desarrollo local):
   ```
   http://localhost:3300/api/auth/google/callback
   ```
5. Haz clic en **"Crear"**

### Paso 7: Copiar las Credenciales

Después de crear el cliente OAuth, verás una ventana con:

- **ID de cliente**: Algo como `123456789-abcdefghijklmnop.apps.googleusercontent.com`
- **Secreto de cliente**: Algo como `GOCSPX-abcdefghijklmnopqrstuvwxyz`

⚠️ **IMPORTANTE**: Copia estos valores inmediatamente, ya que el secreto solo se muestra una vez.

### Paso 8: Configurar en tu Proyecto

1. Crea o edita el archivo `.env` en la carpeta `backend/`
2. Agrega las siguientes líneas:

```env
GOOGLE_CLIENT_ID=tu-id-de-cliente-aqui
GOOGLE_CLIENT_SECRET=tu-secreto-de-cliente-aqui
```

**Ejemplo:**
```env
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz
```

## 🔧 Configuración Adicional

### Para Producción

Cuando despliegues tu aplicación en producción, necesitarás:

1. **Actualizar el URI de redirección** en Google Cloud Console:
   ```
   https://tu-dominio.com/api/auth/google/callback
   ```

2. **Agregar orígenes JavaScript autorizados**:
   - Ve a tu cliente OAuth en Google Cloud Console
   - En "Orígenes JavaScript autorizados", agrega:
     ```
     https://tu-dominio.com
     ```

3. **Actualizar las variables de entorno** en producción:
   ```env
   API_BASE_URL=https://tu-dominio.com
   FRONTEND_URL=https://tu-dominio.com
   ```

## ✅ Verificación

Para verificar que todo está configurado correctamente:

1. Asegúrate de que el archivo `.env` tenga las credenciales correctas
2. Inicia el servidor backend:
   ```bash
   cd backend
   npm run dev
   ```
3. Inicia el frontend:
   ```bash
   cd frontend
   npm run dev
   ```
4. Ve a `http://localhost:5173/login`
5. Haz clic en "Sign in with Google Workspace"
6. Deberías ser redirigido a Google para autenticarte

## 🐛 Solución de Problemas

### Error: "redirect_uri_mismatch"

- Verifica que el URI de redirección en Google Cloud Console coincida **exactamente** con:
  ```
  http://localhost:3300/api/auth/google/callback
  ```
- Asegúrate de que no haya espacios o caracteres extra

### Error: "invalid_client"

- Verifica que el `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` estén correctos en el archivo `.env`
- Asegúrate de que no haya espacios antes o después de los valores

### Error: "access_denied"

- Verifica que la pantalla de consentimiento OAuth esté configurada correctamente
- Si estás en modo de prueba, asegúrate de que tu email esté en la lista de usuarios de prueba

## 📚 Recursos Adicionales

- [Documentación de Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Guía de Passport.js con Google](http://www.passportjs.org/howtos/passport-google-oauth20/)
- [Google Cloud Console](https://console.cloud.google.com/)

---

**Nota**: Mantén tus credenciales seguras y nunca las subas a repositorios públicos. El archivo `.env` debe estar en `.gitignore`.

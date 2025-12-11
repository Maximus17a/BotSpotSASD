# Guía de Instalación Detallada

## Paso 1: Configurar Discord Developer Portal

### 1.1 Crear Aplicación
1. Ve a https://discord.com/developers/applications
2. Clic en "New Application"
3. Dale un nombre (ej: "BotSpotSASD")
4. Acepta los términos y crea

### 1.2 Configurar Bot
1. Ve a la pestaña "Bot"
2. Clic en "Add Bot"
3. Activa las siguientes opciones en "Privileged Gateway Intents":
   - Presence Intent
   - Server Members Intent
   - Message Content Intent
4. Copia el token del bot (lo necesitarás después)

### 1.3 Configurar OAuth2
1. Ve a "OAuth2" → "General"
2. Copia el "Client ID" y "Client Secret"
3. Ve a "OAuth2" → "Redirects"
4. Agrega: `http://localhost:3001/api/auth/callback`
5. Para producción, agrega también: `https://tu-dominio.com/api/auth/callback`

### 1.4 Generar URL de Invitación
1. Ve a "OAuth2" → "URL Generator"
2. Selecciona scopes:
   - `bot`
   - `applications.commands`
3. Selecciona permisos:
   - Manage Roles
   - Manage Channels
   - Kick Members
   - Ban Members
   - Send Messages
   - Manage Messages
   - Read Message History
   - Use Slash Commands
4. Copia la URL generada e invita el bot a tu servidor

## Paso 2: Configurar Base de Datos (Supabase / PostgreSQL)

Este proyecto utiliza **PostgreSQL**. Recomendamos usar **Supabase** por su facilidad de uso.

1. Ve a https://supabase.com y crea una cuenta.
2. Crea un nuevo proyecto.
3. Ve a **Project Settings** → **Database** → **Connection String** → **URI**.
4. Copia la cadena de conexión. Debería verse así:
   `postgresql://postgres:[TU_PASSWORD]@db.[TU_PROYECTO].supabase.co:5432/postgres`
   *(Recuerda reemplazar `[TU_PASSWORD]` con la contraseña que creaste para la base de datos)*.

5. Ve al **SQL Editor** en Supabase.
6. Abre el archivo `database_postgres.sql` que se encuentra en la raíz de este proyecto.
7. Copia todo su contenido y pégalo en el SQL Editor de Supabase.
8. Ejecuta el script para crear todas las tablas necesarias.

## Paso 3: Instalar Node.js y Dependencias

### 3.1 Instalar Node.js
1. Descarga Node.js 18+ desde https://nodejs.org/
2. Instala con las opciones por defecto
3. Verifica la instalación:

```powershell
node --version
npm --version
```

### 3.2 Instalar Dependencias del Bot

```powershell
cd bot
npm install
```

### 3.3 Instalar Dependencias del Backend

```powershell
cd ../web
npm install
```

### 3.4 Instalar Dependencias del Frontend

```powershell
cd client
npm install
```

## Paso 4: Configurar Variables de Entorno

### 4.1 Bot

```powershell
cd ../../bot
copy .env.example .env
```

Edita `bot/.env`:

```env
DISCORD_TOKEN=tu_token_del_bot_aqui
DISCORD_CLIENT_ID=tu_client_id_aqui
DISCORD_CLIENT_SECRET=tu_client_secret_aqui
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"
BOT_PREFIX=!
NODE_ENV=development
```

### 4.2 Backend

```powershell
cd ../web
copy .env.example .env
```

Edita `web/.env`:

```env
DISCORD_CLIENT_ID=tu_client_id_aqui
DISCORD_CLIENT_SECRET=tu_client_secret_aqui
DISCORD_REDIRECT_URI=http://localhost:3001/api/auth/callback
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"
JWT_SECRET=genera_un_string_aleatorio_largo_aqui
SESSION_SECRET=otro_string_aleatorio_largo_aqui
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
PORT=3001
```

### 4.3 Frontend

```powershell
cd client
copy .env.example .env
```

Edita `web/client/.env`:

```env
VITE_API_URL=http://localhost:3001
VITE_DISCORD_CLIENT_ID=tu_client_id_aqui
```

## Paso 5: Ejecutar el Proyecto

Abre **3 ventanas de PowerShell separadas**:

### Ventana 1 - Bot

```powershell
cd bot
npm run dev
```

Deberías ver: "✅ Bot conectado como TuBot#1234"

### Ventana 2 - Backend

```powershell
cd web
npm run dev:server
```

Deberías ver: "🚀 Servidor ejecutándose en http://localhost:3001"

### Ventana 3 - Frontend

```powershell
cd web/client
npm run dev
```

Deberías ver: "Local: http://localhost:5173"

## Paso 6: Probar el Sistema

1. Abre tu navegador en http://localhost:5173
2. Clic en "Iniciar sesión con Discord"
3. Autoriza la aplicación
4. Selecciona tu servidor
5. ¡Comienza a configurar!

## Solución de Problemas Comunes

### Error: Cannot find module 'pg'
```powershell
cd bot
npm install pg
```
(O en la carpeta `web` si el error es del servidor)

### Error de conexión a la base de datos
- Verifica que la `DATABASE_URL` sea correcta y empiece con `postgresql://`.
- Asegúrate de que la contraseña en la URL no tenga caracteres especiales que rompan el formato (si los tiene, deben estar codificados en URL, ej: `%20` para espacios).
- Verifica que tu base de datos en Supabase no esté pausada.

### Error: Invalid token
- Verifica que copiaste correctamente el token del bot
- Regenera el token en Discord Developer Portal

### El bot no responde a comandos
- Verifica que el bot tenga permisos en tu servidor
- Verifica que "Message Content Intent" esté activado en el portal de desarrolladores
- Espera unos minutos para que Discord registre los comandos

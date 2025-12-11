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

## Paso 2: Configurar MySQL

### Opción A: Local (Windows)

1. Descarga MySQL Community Server desde https://dev.mysql.com/downloads/mysql/
2. Instala con las opciones por defecto
3. Configura una contraseña para el usuario `root`
4. Abre MySQL Workbench o cualquier cliente MySQL
5. Ejecuta:

```sql
CREATE DATABASE botspotsasd CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE botspotsasd;
```

6. Copia y ejecuta el esquema de `web/drizzle/schema.ts` convertido a SQL:

```sql
CREATE TABLE guilds (
  id INT PRIMARY KEY AUTO_INCREMENT,
  guildId VARCHAR(64) NOT NULL UNIQUE,
  guildName VARCHAR(255) NOT NULL,
  ownerId VARCHAR(64) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE welcomeConfigs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  guildId VARCHAR(64) NOT NULL UNIQUE,
  enabled BOOLEAN DEFAULT TRUE,
  channelId VARCHAR(64),
  message TEXT,
  imageUrl TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE automodConfigs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  guildId VARCHAR(64) NOT NULL UNIQUE,
  enabled BOOLEAN DEFAULT TRUE,
  antiSpam BOOLEAN DEFAULT TRUE,
  bannedWords TEXT,
  bannedLinks TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE userModerations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  guildId VARCHAR(64) NOT NULL,
  userId VARCHAR(64) NOT NULL,
  type ENUM('warn', 'ban', 'kick') NOT NULL,
  reason TEXT,
  moderatorId VARCHAR(64) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE forms (
  id INT PRIMARY KEY AUTO_INCREMENT,
  guildId VARCHAR(64) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  fields TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE formSubmissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  formId INT NOT NULL,
  guildId VARCHAR(64) NOT NULL,
  userId VARCHAR(64) NOT NULL,
  data TEXT NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  reviewedBy VARCHAR(64),
  reviewedAt TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE roleConfigs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  guildId VARCHAR(64) NOT NULL,
  roleId VARCHAR(64) NOT NULL,
  autoAssign BOOLEAN DEFAULT FALSE,
  requiresVerification BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE userRoles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  guildId VARCHAR(64) NOT NULL,
  userId VARCHAR(64) NOT NULL,
  roleId VARCHAR(64) NOT NULL,
  assignedBy VARCHAR(64),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Opción B: Cloud (Supabase)

1. Ve a https://supabase.com y crea una cuenta
2. Crea un nuevo proyecto
3. Ve a "Database" → "Connection String"
4. Copia la cadena de conexión (formato MySQL)
5. Usa el SQL Editor para ejecutar el esquema anterior

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
cd C:\Users\Usuario\Downloads\BotSpotSASD\bot
npm install
```

### 3.3 Instalar Dependencias del Backend

```powershell
cd ..\web
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
cd C:\Users\Usuario\Downloads\BotSpotSASD\bot
copy .env.example .env
```

Edita `bot/.env`:

```
DISCORD_TOKEN=tu_token_del_bot_aqui
DISCORD_CLIENT_ID=tu_client_id_aqui
DISCORD_CLIENT_SECRET=tu_client_secret_aqui
DATABASE_URL=mysql://root:tu_password@localhost:3306/botspotsasd
BOT_PREFIX=!
NODE_ENV=development
```

### 4.2 Backend

```powershell
cd ..\web
copy .env.example .env
```

Edita `web/.env`:

```
DISCORD_CLIENT_ID=tu_client_id_aqui
DISCORD_CLIENT_SECRET=tu_client_secret_aqui
DISCORD_REDIRECT_URI=http://localhost:3001/api/auth/callback
DATABASE_URL=mysql://root:tu_password@localhost:3306/botspotsasd
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

```
VITE_API_URL=http://localhost:3001
VITE_DISCORD_CLIENT_ID=tu_client_id_aqui
```

## Paso 5: Ejecutar el Proyecto

Abre **3 ventanas de PowerShell separadas**:

### Ventana 1 - Bot

```powershell
cd C:\Users\Usuario\Downloads\BotSpotSASD\bot
npm run dev
```

Deberías ver: "✅ Bot conectado como TuBot#1234"

### Ventana 2 - Backend

```powershell
cd C:\Users\Usuario\Downloads\BotSpotSASD\web
npm run dev:server
```

Deberías ver: "🚀 Servidor ejecutándose en http://localhost:3001"

### Ventana 3 - Frontend

```powershell
cd C:\Users\Usuario\Downloads\BotSpotSASD\web\client
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

### Error: Cannot find module 'discord.js'
```powershell
cd bot
npm install
```

### Error: ECONNREFUSED al conectar a MySQL
- Verifica que MySQL esté corriendo
- Verifica la contraseña en DATABASE_URL
- Verifica el puerto (3306 por defecto)

### Error: Invalid token
- Verifica que copiaste correctamente el token del bot
- Regenera el token en Discord Developer Portal

### El bot no responde a comandos
- Verifica que el bot tenga permisos en tu servidor
- Verifica que "Message Content Intent" esté activado
- Espera unos minutos para que Discord registre los comandos

### Error de CORS en el frontend
- Verifica que FRONTEND_URL en el backend apunte a http://localhost:5173
- Verifica que VITE_API_URL en el frontend apunte a http://localhost:3001

## Siguientes Pasos

- Lee la documentación de uso en README.md
- Personaliza los mensajes de bienvenida
- Configura la automoderación
- Crea tus primeros formularios
- Invita más administradores

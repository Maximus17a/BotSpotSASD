# Guía de Despliegue (Render & Vercel)

Esta guía te ayudará a subir tu proyecto a producción.

## 1. Preparación (GitHub)

Asegúrate de que todo tu código esté subido a un repositorio de GitHub.
1. Crea un repositorio en GitHub.
2. Sube todo el contenido de la carpeta `BotSpotSASD`.

## 2. Desplegar el Backend y el Bot en Render

Render alojará tanto tu servidor web (API) como tu bot de Discord.

### 2.1 Crear el Web Service (Backend API)
1. Ve a [dashboard.render.com](https://dashboard.render.com/).
2. Click en **New +** -> **Web Service**.
3. Conecta tu repositorio de GitHub.
4. Configura lo siguiente:
   - **Name:** `botspotsasd-api` (o el nombre que quieras)
   - **Root Directory:** `web`
   - **Runtime:** Node
   - **Build Command:** `npm install && npm run build:server`
   - **Start Command:** `npm start`
5. **Environment Variables (Variables de Entorno):**
   Copia las variables de tu archivo `web/.env`, PERO actualiza las siguientes:
   - `DATABASE_URL`: La URL de Supabase (`postgresql://...`).
   - `FRONTEND_URL`: La URL que te dará Vercel (ej: `https://botspotsasd.vercel.app`). *Puedes poner un valor temporal y actualizarlo después de desplegar el frontend.*
   - `DISCORD_REDIRECT_URI`: `https://[TU-URL-DE-RENDER].onrender.com/api/auth/callback` *(Actualiza esto una vez Render te asigne la URL)*.
   - `PORT`: `10000` (Render usa este puerto por defecto).

### 2.2 Crear el Background Worker (Discord Bot)
1. Click en **New +** -> **Background Worker**.
2. Conecta el mismo repositorio.
3. Configura lo siguiente:
   - **Name:** `botspotsasd-bot`
   - **Root Directory:** `bot`
   - **Runtime:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
4. **Environment Variables:**
   Copia las variables de tu archivo `bot/.env`:
   - `DISCORD_TOKEN`
   - `DISCORD_CLIENT_ID`
   - `DATABASE_URL` (La misma de Supabase)
   - `BOT_PREFIX`

## 3. Desplegar el Frontend en Vercel

Vercel alojará tu página web (React).

1. Ve a [vercel.com](https://vercel.com/).
2. Click en **Add New...** -> **Project**.
3. Importa tu repositorio de GitHub.
4. Configura lo siguiente:
   - **Framework Preset:** Vite
   - **Root Directory:** Click en "Edit" y selecciona `web/client`.
5. **Environment Variables:**
   - `VITE_API_URL`: La URL de tu backend en Render (ej: `https://botspotsasd-api.onrender.com`). **Importante: No pongas la barra `/` al final.**
   - `VITE_DISCORD_CLIENT_ID`: Tu ID de cliente de Discord.
6. Click en **Deploy**.

## 4. Configuración Final (Importante)

Una vez tengas las URLs definitivas de Render y Vercel:

1. **Actualiza Discord Developer Portal:**
   - Ve a la sección **OAuth2** -> **Redirects**.
   - Agrega la URL de redirección de producción: `https://[TU-URL-DE-RENDER].onrender.com/api/auth/callback`

2. **Actualiza Render (Backend):**
   - Ve a las variables de entorno de tu Web Service.
   - Actualiza `FRONTEND_URL` con la URL de Vercel (ej: `https://tu-proyecto.vercel.app`).
   - Actualiza `DISCORD_REDIRECT_URI` con la URL de Render (ej: `https://tu-api.onrender.com/api/auth/callback`).

3. **Reinicia el servicio en Render** para que tome los cambios.

¡Listo! Tu proyecto debería estar funcionando en producción.

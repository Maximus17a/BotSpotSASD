# Guía de Despliegue (Deployment Guide)

Esta guía te ayudará a desplegar tu aplicación BotSpotSASD en **Render** (Backend y Bot) y **Vercel** (Frontend), utilizando los planes gratuitos.

## Prerrequisitos

1.  Cuenta en [GitHub](https://github.com).
2.  Cuenta en [Render](https://render.com).
3.  Cuenta en [Vercel](https://vercel.com).
4.  Base de datos PostgreSQL en [Supabase](https://supabase.com) (ya configurada).

---

## 1. Preparación del Repositorio

Asegúrate de que tu código esté subido a un repositorio de GitHub.

## 2. Despliegue del Backend (API) en Render

El Backend es el servidor Express que maneja la API del dashboard.

1.  Ve a tu Dashboard de Render y haz clic en **New +** -> **Web Service**.
2.  Conecta tu repositorio de GitHub.
3.  Configura el servicio con los siguientes datos:
    *   **Name:** `botspotsasd-api` (o el nombre que prefieras)
    *   **Root Directory:** `web`
    *   **Environment:** `Node`
    *   **Build Command:** `npm install && npm run build:server`
    *   **Start Command:** `npm start`
    *   **Plan:** Free
4.  En la sección **Environment Variables**, añade las siguientes variables (copia los valores de tu `.env` local):
    *   `DATABASE_URL`: Tu URL de conexión de Supabase.
    *   `SESSION_SECRET`: Una cadena secreta larga.
    *   `DISCORD_CLIENT_ID`: ID de tu aplicación de Discord.
    *   `DISCORD_CLIENT_SECRET`: Secreto de tu aplicación de Discord.
    *   `DISCORD_REDIRECT_URI`: `https://<TU-URL-DE-RENDER-API>/api/auth/callback` (Actualizarás esto una vez se cree el servicio).
    *   `FRONTEND_URL`: `https://<TU-URL-DE-VERCEL>` (Lo actualizarás después de desplegar el frontend).
    *   `NODE_ENV`: `production`
5.  Haz clic en **Create Web Service**.

## 3. Despliegue del Bot de Discord en Render

Para usar el plan gratuito de Render, desplegaremos el Bot como un **Web Service** en lugar de un Background Worker. Hemos añadido un pequeño servidor HTTP al bot para que cumpla con los requisitos de Render.

1.  Ve a tu Dashboard de Render y haz clic en **New +** -> **Web Service**.
2.  Conecta el **mismo** repositorio de GitHub.
3.  Configura el servicio:
    *   **Name:** `botspotsasd-bot`
    *   **Root Directory:** `bot`
    *   **Environment:** `Node`
    *   **Build Command:** `npm install && npm run build`
    *   **Start Command:** `npm start`
    *   **Plan:** Free
4.  Añade las variables de entorno:
    *   `DISCORD_TOKEN`: El token de tu bot.
    *   `DISCORD_CLIENT_ID`: ID de tu aplicación.
    *   `DATABASE_URL`: La misma URL de Supabase.
    *   `BOT_PREFIX`: `!` (o el que prefieras).
    *   `NODE_ENV`: `production`
5.  Haz clic en **Create Web Service**.
    *   *Nota: Render asignará automáticamente un puerto (`PORT`) y el bot escuchará en él para mantenerse vivo.*

## 4. Despliegue del Frontend en Vercel

1.  Ve a tu Dashboard de Vercel y haz clic en **Add New...** -> **Project**.
2.  Importa tu repositorio de GitHub.
3.  Configura el proyecto:
    *   **Framework Preset:** Vite
    *   **Root Directory:** Haz clic en `Edit` y selecciona la carpeta `web/client`.
4.  En **Environment Variables**, añade:
    *   `VITE_API_URL`: La URL de tu Backend en Render (ej. `https://botspotsasd-api.onrender.com`). **Importante:** No incluyas la barra `/` al final.
5.  Haz clic en **Deploy**.

## 5. Configuración Final

1.  **Actualizar URLs:**
    *   Vuelve a Render -> Servicio API -> Environment Variables.
    *   Actualiza `FRONTEND_URL` con la URL que te dio Vercel (ej. `https://botspotsasd-web.vercel.app`).
    *   Guarda los cambios.
2.  **Discord Developer Portal:**
    *   Ve a [Discord Developers](https://discord.com/developers/applications).
    *   Selecciona tu aplicación -> **OAuth2**.
    *   En **Redirects**, añade la URL de callback de tu API en Render: `https://<TU-URL-DE-RENDER-API>/api/auth/callback`.
3.  **Reiniciar Servicios:**
    *   En Render, fuerza un nuevo despliegue (Manual Deploy) de tu API para que tome la nueva variable `FRONTEND_URL`.

¡Listo! Tu aplicación completa debería estar funcionando.

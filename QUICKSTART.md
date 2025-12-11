# 🚀 Inicio Rápido - BotSpotSASD

## ⚡ Pasos Mínimos para Empezar

### 1. Configurar Discord (5 minutos)
1. Ve a https://discord.com/developers/applications
2. Crea una nueva aplicación
3. Crea un bot y copia el token
4. En OAuth2, agrega redirect: `http://localhost:3001/api/auth/callback`
5. Invita el bot a tu servidor con permisos de administrador

### 2. Configurar Base de Datos (3 minutos)
```powershell
# Abre MySQL y ejecuta:
CREATE DATABASE botspotsasd;
USE botspotsasd;

# Luego importa database.sql
```

### 3. Instalar Todo (2 minutos)
```powershell
cd C:\Users\Usuario\Downloads\BotSpotSASD

# Bot
cd bot
npm install
copy .env.example .env
# Edita .env con tu token de Discord

# Backend
cd ..\web
npm install
copy .env.example .env
# Edita .env con tus credenciales

# Frontend
cd client
npm install
copy .env.example .env
# Edita .env
```

### 4. Ejecutar (1 minuto)
```powershell
# Terminal 1
cd bot
npm run dev

# Terminal 2
cd web
npm run dev:server

# Terminal 3
cd web\client
npm run dev
```

### 5. ¡Listo! 🎉
Abre http://localhost:5173 y comienza a configurar tu bot.

## 📝 Variables de Entorno Esenciales

### bot/.env
```
DISCORD_TOKEN=tu_token_aqui
DATABASE_URL=mysql://root:password@localhost:3306/botspotsasd
```

### web/.env
```
DISCORD_CLIENT_ID=tu_client_id
DISCORD_CLIENT_SECRET=tu_client_secret
DATABASE_URL=mysql://root:password@localhost:3306/botspotsasd
JWT_SECRET=cualquier_string_aleatorio_largo
SESSION_SECRET=otro_string_aleatorio_largo
```

### web/client/.env
```
VITE_API_URL=http://localhost:3001
```

## 🎯 Primeros Pasos Después de Instalar

1. **Inicia sesión** en http://localhost:5173
2. **Selecciona tu servidor** desde el Dashboard
3. **Configura bienvenida**: Ve a Welcome y personaliza el mensaje
4. **Prueba comandos**:
   - Escribe `/warn @usuario razón` en Discord
   - Escribe `/form list` para ver formularios
5. **Explora el panel** y configura más opciones

## ❓ Problemas Comunes

### Bot no se conecta
- Verifica el token en `bot/.env`
- Asegúrate de que MySQL esté corriendo

### Panel web no carga
- Verifica que los 3 procesos estén corriendo
- Revisa la consola para errores

### Error de autenticación
- Verifica el redirect URI en Discord Developer Portal
- Asegúrate de que coincida con `DISCORD_REDIRECT_URI` en `web/.env`

## 📚 Documentación Completa

- **README.md** - Información general del proyecto
- **INSTALLATION.md** - Guía detallada de instalación
- **IMPLEMENTATION_STATUS.md** - Estado completo de la implementación

## 🆘 Ayuda

Si tienes problemas, revisa los archivos de documentación o verifica:
1. ¿Están todas las dependencias instaladas?
2. ¿Está MySQL corriendo?
3. ¿Los 3 procesos están activos?
4. ¿Las variables de entorno son correctas?

---

**¡Bienvenido a BotSpotSASD! 🤖✨**

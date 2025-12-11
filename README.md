# BotSpotSASD - Discord Bot con Panel Web

Bot de Discord completo con panel web de configuración que permite gestionar automoderación, formularios, roles, moderación y bienvenida.

## 📋 Características

- ✅ **Sistema de Bienvenida**: Mensajes personalizados para nuevos miembros
- ✅ **Automoderación**: Detecta spam, palabras prohibidas y enlaces maliciosos
- ✅ **Sistema de Formularios**: Formularios personalizables con revisión de admins
- ✅ **Moderación Avanzada**: Warns, bans, kicks con historial
- ✅ **Gestión de Roles**: Autoasignación y gestión manual
- ✅ **Panel Web**: Interfaz amigable con React 19 + Tailwind CSS
- ✅ **Dark Mode**: Tema claro/oscuro
- ✅ **OAuth2**: Autenticación con Discord

## 🏗️ Estructura del Proyecto

```
BotSpotSASD/
├── bot/                    # Bot de Discord (Node.js + discord.js)
│   ├── src/
│   │   ├── commands/       # Comandos slash
│   │   ├── events/         # Event handlers
│   │   ├── handlers/       # Lógica de negocio
│   │   ├── utils/          # Utilidades
│   │   └── index.ts        # Punto de entrada
│   └── package.json
│
├── web/                    # Panel web
│   ├── server/             # Backend Express
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Auth & permissions
│   │   └── index.ts
│   ├── client/             # Frontend React
│   │   ├── src/
│   │   │   ├── pages/      # Páginas principales
│   │   │   ├── components/ # Componentes reutilizables
│   │   │   ├── contexts/   # React contexts
│   │   │   └── hooks/      # Custom hooks
│   │   └── package.json
│   └── drizzle/            # Database schema
│       └── schema.ts
│
└── README.md
```

## 🚀 Instalación

### Prerrequisitos

- Node.js 18+ y npm
- MySQL 8+
- Una aplicación de Discord creada en [Discord Developer Portal](https://discord.com/developers/applications)

### 1. Configurar la Aplicación de Discord

1. Ve a https://discord.com/developers/applications
2. Crea una nueva aplicación
3. Ve a la sección "Bot" y crea un bot
4. Copia el token del bot
5. En "OAuth2" → "Redirects", agrega: `http://localhost:3001/api/auth/callback`
6. Invita el bot a tu servidor con los siguientes permisos:
   - Manage Roles
   - Manage Channels
   - Kick Members
   - Ban Members
   - Read Messages/View Channels
   - Send Messages
   - Manage Messages
   - Read Message History

### 2. Configurar la Base de Datos

```sql
-- Crear base de datos
CREATE DATABASE botspotsasd;
USE botspotsasd;

-- Ejecutar el esquema de la base de datos (ver web/drizzle/schema.ts)
-- O importar desde MySQL Workbench
```

### 3. Instalar Dependencias

```bash
# Bot
cd bot
npm install

# Backend
cd ../web
npm install

# Frontend
cd client
npm install
```

### 4. Configurar Variables de Entorno

**Bot (.env)**:
```bash
cd bot
cp .env.example .env
# Editar .env con tus valores
```

**Backend (.env)**:
```bash
cd ../web
cp .env.example .env
# Editar .env con tus valores
```

**Frontend (.env)**:
```bash
cd client
cp .env.example .env
# Editar .env con tus valores
```

### 5. Ejecutar en Desarrollo

Abre 3 terminales:

**Terminal 1 - Bot:**
```bash
cd bot
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd web
npm run dev:server
```

**Terminal 3 - Frontend:**
```bash
cd web/client
npm run dev
```

Accede al panel en: http://localhost:5173

## 📝 Comandos del Bot

### Moderación
- `/warn <usuario> <razón>` - Advertir a un usuario
- `/ban <usuario> <razón>` - Banear a un usuario
- `/kick <usuario> <razón>` - Expulsar a un usuario
- `/warns <usuario>` - Ver advertencias de un usuario

### Roles
- `/role add <usuario> <rol>` - Asignar rol a un usuario
- `/role remove <usuario> <rol>` - Quitar rol a un usuario
- `/roles` - Ver todos los roles disponibles

### Formularios
- `/form submit <id>` - Enviar un formulario
- `/form list` - Ver formularios disponibles

## 🔧 Panel Web

### Páginas Disponibles

1. **Dashboard** - Vista general con estadísticas
2. **Bienvenida** - Configurar mensajes de bienvenida
3. **Automoderación** - Configurar filtros y reglas
4. **Roles** - Gestionar roles y autoasignación
5. **Formularios** - Crear y editar formularios
6. **Moderación** - Ver historial y estadísticas
7. **Envíos** - Revisar envíos de formularios

## 🌐 Despliegue en Producción

### Bot + Backend (Render)

1. Crea una cuenta en [Render](https://render.com)
2. Crea un nuevo Web Service
3. Conecta tu repositorio
4. Configura:
   - Build Command: `cd bot && npm install && npm run build`
   - Start Command: `cd bot && npm start`
5. Agrega variables de entorno

### Frontend (Vercel)

1. Crea una cuenta en [Vercel](https://vercel.com)
2. Importa tu repositorio
3. Configura:
   - Root Directory: `web/client`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Agrega variables de entorno

### Base de Datos (Supabase/PlanetScale)

Usa Supabase o PlanetScale para MySQL en la nube.

## 🔐 Seguridad

- ✅ Validación de inputs
- ✅ Sanitización de datos
- ✅ Verificación de permisos
- ✅ Tokens JWT con expiración
- ✅ HTTPS en producción
- ✅ Rate limiting (recomendado)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 📞 Soporte

¿Necesitas ayuda? Abre un issue en GitHub.

## 🎯 Roadmap

- [ ] Multiidioma completo (ES, EN, PT)
- [ ] Sistema de tickets
- [ ] Logs de auditoría
- [ ] Dashboard con gráficas en tiempo real
- [ ] Notificaciones en tiempo real (WebSockets)
- [ ] Backup automático de configuraciones
- [ ] Sistema de plugins
- [ ] API pública

## 🙏 Agradecimientos

- discord.js
- React
- Tailwind CSS
- shadcn/ui
- Drizzle ORM

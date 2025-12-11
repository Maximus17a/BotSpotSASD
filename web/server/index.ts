import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import session from 'express-session';

// Import routes
import authRoutes from './routes/auth';
import guildsRoutes from './routes/guilds';
import welcomeRoutes from './routes/welcome';
import automodRoutes from './routes/automod';
import rolesRoutes from './routes/roles';
import formsRoutes from './routes/forms';
import moderationRoutes from './routes/moderation';
import submissionsRoutes from './routes/submissions';

// Extend express-session types
declare module 'express-session' {
  interface SessionData {
    accessToken?: string;
    user?: {
      id: string;
      username: string;
      discriminator: string;
      avatar?: string;
    };
  }
}

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/guilds', guildsRoutes);
app.use('/api/welcome', welcomeRoutes);
app.use('/api/automod', automodRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/forms', formsRoutes);
app.use('/api/moderation', moderationRoutes);
app.use('/api/submissions', submissionsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`📝 Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log(`🔗 OAuth redirect: ${process.env.DISCORD_REDIRECT_URI}`);
});

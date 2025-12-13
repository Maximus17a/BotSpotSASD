import express from 'express';
import axios from 'axios';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import jwt from 'jsonwebtoken';

const router = express.Router();

// OAuth2 login
router.get('/login', (req, res) => {
  const redirectUri = encodeURIComponent(process.env.DISCORD_REDIRECT_URI || '');
  const clientId = process.env.DISCORD_CLIENT_ID;
  const scope = 'identify guilds';
  
  const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
  
  res.redirect(authUrl);
});

// OAuth2 callback
router.get('/callback', async (req, res) => {
  const code = req.query.code as string;

  if (!code) {
    return res.redirect(`${process.env.FRONTEND_URL}?error=no_code`);
  }

  try {
    // Exchange code for access token
    const tokenResponse = await axios.post(
      'https://discord.com/api/oauth2/token',
      new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID || '',
        client_secret: process.env.DISCORD_CLIENT_SECRET || '',
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.DISCORD_REDIRECT_URI || '',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { access_token } = tokenResponse.data;

    // Get user info
    const userResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const user = userResponse.data;

    // Create JWT
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        discriminator: user.discriminator,
        avatar: user.avatar,
      },
      process.env.JWT_SECRET || '',
      { expiresIn: '7d' }
    );

    // No es necesario almacenar en la sesión si usamos JWT para /me
    // req.session.accessToken = access_token;
    // req.session.user = user;

    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${token}`);
  } catch (error) {
    console.error('Error in OAuth callback:', error);
    res.redirect(`${process.env.FRONTEND_URL}?error=auth_failed`);
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  // El middleware authenticateToken ya ha verificado el JWT y adjuntado el usuario a req.user
  res.json((req as AuthRequest).user);
});

// Logout
router.post('/logout', (req, res) => {
  // Con la autenticación basada en JWT, el logout es simplemente eliminar el token del lado del cliente.
  // No se requiere acción en el servidor, pero se mantiene la ruta para consistencia.
  res.json({ success: true });
});

export default router;

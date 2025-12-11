import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import axios from 'axios';

export async function checkGuildPermissions(req: Request, res: Response, next: NextFunction) {
  const authReq = req as AuthRequest;
  const guildId = req.params.guildId;

  if (!authReq.user) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    // Get user's guilds from Discord API
    const response = await axios.get('https://discord.com/api/users/@me/guilds', {
      headers: {
        Authorization: `Bearer ${req.session.accessToken}`,
      },
    });

    const guild = response.data.find((g: any) => g.id === guildId);

    if (!guild) {
      return res.status(404).json({ error: 'Servidor no encontrado' });
    }

    // Check if user has admin permissions (permission value 0x8 = ADMINISTRATOR)
    const hasAdmin = (parseInt(guild.permissions) & 0x8) === 0x8;

    if (!hasAdmin && guild.owner !== true) {
      return res.status(403).json({ error: 'No tienes permisos de administrador en este servidor' });
    }

    next();
  } catch (error) {
    console.error('Error checking permissions:', error);
    return res.status(500).json({ error: 'Error al verificar permisos' });
  }
}

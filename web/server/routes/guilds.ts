import express from 'express';
import axios from 'axios';
import { authenticateToken } from '../middleware/auth';
import { query } from '../utils/database';

const router = express.Router();

// Get user's guilds
router.get('/', authenticateToken, async (req, res) => {
  try {
    const response = await axios.get('https://discord.com/api/users/@me/guilds', {
      headers: {
        Authorization: `Bearer ${req.session.accessToken}`,
      },
    });

    // Filter guilds where user has admin permissions
    const adminGuilds = response.data.filter((guild: any) => {
      const hasAdmin = (parseInt(guild.permissions) & 0x8) === 0x8;
      return hasAdmin || guild.owner;
    });

    res.json(adminGuilds);
  } catch (error) {
    console.error('Error fetching guilds:', error);
    res.status(500).json({ error: 'Error al obtener servidores' });
  }
});

// Get guild details
router.get('/:guildId', authenticateToken, async (req, res) => {
  const { guildId } = req.params;

  try {
    // Check if guild exists in database
    let guild = await query(
      'SELECT * FROM guilds WHERE guildId = ?',
      [guildId]
    );

    if (guild.length === 0) {
      // Guild doesn't exist in DB, create it
      await query(
        'INSERT INTO guilds (guildId, guildName, ownerId) VALUES (?, ?, ?)',
        [guildId, 'Unknown', req.session.user?.id || '']
      );
    }

    res.json({ guildId });
  } catch (error) {
    console.error('Error fetching guild:', error);
    res.status(500).json({ error: 'Error al obtener servidor' });
  }
});

export default router;

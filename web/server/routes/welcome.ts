import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { checkGuildPermissions } from '../middleware/permissions';
import { query, queryOne } from '../utils/database';

const router = express.Router();

// Get welcome config
router.get('/:guildId', authenticateToken, checkGuildPermissions, async (req, res) => {
  const { guildId } = req.params;

  try {
    let config = await queryOne(
      'SELECT * FROM welcomeConfigs WHERE guildId = ?',
      [guildId]
    );

    if (!config) {
      // Create default config
      await query(
        'INSERT INTO welcomeConfigs (guildId, enabled, message) VALUES (?, ?, ?)',
        [guildId, true, 'Bienvenido {user} a {server}!']
      );

      config = await queryOne(
        'SELECT * FROM welcomeConfigs WHERE guildId = ?',
        [guildId]
      );
    }

    res.json(config);
  } catch (error) {
    console.error('Error fetching welcome config:', error);
    res.status(500).json({ error: 'Error al obtener configuración de bienvenida' });
  }
});

// Update welcome config
router.post('/:guildId', authenticateToken, checkGuildPermissions, async (req, res) => {
  const { guildId } = req.params;
  const { enabled, channelId, message, imageUrl } = req.body;

  try {
    await query(
      'UPDATE welcomeConfigs SET enabled = ?, channelId = ?, message = ?, imageUrl = ? WHERE guildId = ?',
      [enabled, channelId, message, imageUrl, guildId]
    );

    const config = await queryOne(
      'SELECT * FROM welcomeConfigs WHERE guildId = ?',
      [guildId]
    );

    res.json(config);
  } catch (error) {
    console.error('Error updating welcome config:', error);
    res.status(500).json({ error: 'Error al actualizar configuración de bienvenida' });
  }
});

export default router;

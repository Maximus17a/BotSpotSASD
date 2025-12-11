import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { checkGuildPermissions } from '../middleware/permissions';
import { query, queryOne } from '../utils/database';

const router = express.Router();

// Get automod config
router.get('/:guildId', authenticateToken, checkGuildPermissions, async (req, res) => {
  const { guildId } = req.params;

  try {
    let config = await queryOne<any>(
      'SELECT * FROM automodConfigs WHERE guildId = ?',
      [guildId]
    );

    if (!config) {
      // Create default config
      await query(
        'INSERT INTO automodConfigs (guildId, enabled, antiSpam, bannedWords, bannedLinks) VALUES (?, ?, ?, ?, ?)',
        [guildId, true, true, JSON.stringify([]), JSON.stringify([])]
      );

      config = await queryOne(
        'SELECT * FROM automodConfigs WHERE guildId = ?',
        [guildId]
      );
    }

    // Parse JSON fields
    if (config) {
      config.bannedWords = JSON.parse(config.bannedWords || '[]');
      config.bannedLinks = JSON.parse(config.bannedLinks || '[]');
    }

    res.json(config);
  } catch (error) {
    console.error('Error fetching automod config:', error);
    res.status(500).json({ error: 'Error al obtener configuración de automoderación' });
  }
});

// Update automod config
router.post('/:guildId', authenticateToken, checkGuildPermissions, async (req, res) => {
  const { guildId } = req.params;
  const { enabled, antiSpam, bannedWords, bannedLinks } = req.body;

  try {
    await query(
      'UPDATE automodConfigs SET enabled = ?, antiSpam = ?, bannedWords = ?, bannedLinks = ? WHERE guildId = ?',
      [enabled, antiSpam, JSON.stringify(bannedWords), JSON.stringify(bannedLinks), guildId]
    );

    let config = await queryOne<any>(
      'SELECT * FROM automodConfigs WHERE guildId = ?',
      [guildId]
    );

    if (config) {
      config.bannedWords = JSON.parse(config.bannedWords || '[]');
      config.bannedLinks = JSON.parse(config.bannedLinks || '[]');
    }

    res.json(config);
  } catch (error) {
    console.error('Error updating automod config:', error);
    res.status(500).json({ error: 'Error al actualizar configuración de automoderación' });
  }
});

export default router;

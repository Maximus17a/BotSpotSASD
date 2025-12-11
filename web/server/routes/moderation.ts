import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { checkGuildPermissions } from '../middleware/permissions';
import { query } from '../utils/database';

const router = express.Router();

// Get all moderations for a guild
router.get('/:guildId', authenticateToken, checkGuildPermissions, async (req, res) => {
  const { guildId } = req.params;
  const { type, userId } = req.query;

  try {
    let sql = 'SELECT * FROM userModerations WHERE guildId = ?';
    const params: any[] = [guildId];

    if (type) {
      sql += ' AND type = ?';
      params.push(type);
    }

    if (userId) {
      sql += ' AND userId = ?';
      params.push(userId);
    }

    sql += ' ORDER BY createdAt DESC';

    const moderations = await query(sql, params);

    res.json(moderations);
  } catch (error) {
    console.error('Error fetching moderations:', error);
    res.status(500).json({ error: 'Error al obtener moderaciones' });
  }
});

// Get moderations for a specific user
router.get('/:guildId/users/:userId', authenticateToken, checkGuildPermissions, async (req, res) => {
  const { guildId, userId } = req.params;

  try {
    const moderations = await query(
      'SELECT * FROM userModerations WHERE guildId = ? AND userId = ? ORDER BY createdAt DESC',
      [guildId, userId]
    );

    res.json(moderations);
  } catch (error) {
    console.error('Error fetching user moderations:', error);
    res.status(500).json({ error: 'Error al obtener moderaciones del usuario' });
  }
});

// Add a warn
router.post('/:guildId/warn', authenticateToken, checkGuildPermissions, async (req, res) => {
  const { guildId } = req.params;
  const { userId, reason } = req.body;

  try {
    await query(
      'INSERT INTO userModerations (guildId, userId, type, reason, moderatorId) VALUES (?, ?, ?, ?, ?)',
      [guildId, userId, 'warn', reason, req.session.user?.id]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error adding warn:', error);
    res.status(500).json({ error: 'Error al agregar advertencia' });
  }
});

// Add a ban
router.post('/:guildId/ban', authenticateToken, checkGuildPermissions, async (req, res) => {
  const { guildId } = req.params;
  const { userId, reason } = req.body;

  try {
    await query(
      'INSERT INTO userModerations (guildId, userId, type, reason, moderatorId) VALUES (?, ?, ?, ?, ?)',
      [guildId, userId, 'ban', reason, req.session.user?.id]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error adding ban:', error);
    res.status(500).json({ error: 'Error al agregar baneo' });
  }
});

// Add a kick
router.post('/:guildId/kick', authenticateToken, checkGuildPermissions, async (req, res) => {
  const { guildId } = req.params;
  const { userId, reason } = req.body;

  try {
    await query(
      'INSERT INTO userModerations (guildId, userId, type, reason, moderatorId) VALUES (?, ?, ?, ?, ?)',
      [guildId, userId, 'kick', reason, req.session.user?.id]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error adding kick:', error);
    res.status(500).json({ error: 'Error al agregar expulsión' });
  }
});

// Get moderation statistics
router.get('/:guildId/stats', authenticateToken, checkGuildPermissions, async (req, res) => {
  const { guildId } = req.params;

  try {
    const stats = await query<any>(
      `SELECT 
        type,
        COUNT(*) as count
      FROM userModerations
      WHERE guildId = ?
      GROUP BY type`,
      [guildId]
    );

    const result: any = {
      warns: 0,
      bans: 0,
      kicks: 0,
    };

    stats.forEach(stat => {
      result[`${stat.type}s`] = stat.count;
    });

    res.json(result);
  } catch (error) {
    console.error('Error fetching moderation stats:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

export default router;

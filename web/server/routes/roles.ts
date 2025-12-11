import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { checkGuildPermissions } from '../middleware/permissions';
import { query } from '../utils/database';

const router = express.Router();

// Get role configs
router.get('/:guildId', authenticateToken, checkGuildPermissions, async (req, res) => {
  const { guildId } = req.params;

  try {
    const roles = await query(
      'SELECT * FROM roleConfigs WHERE guildId = ?',
      [guildId]
    );

    res.json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ error: 'Error al obtener configuración de roles' });
  }
});

// Add or update role config
router.post('/:guildId', authenticateToken, checkGuildPermissions, async (req, res) => {
  const { guildId } = req.params;
  const { roleId, autoAssign, requiresVerification } = req.body;

  try {
    // Check if role config exists
    const existing = await query(
      'SELECT * FROM roleConfigs WHERE guildId = ? AND roleId = ?',
      [guildId, roleId]
    );

    if (existing.length > 0) {
      // Update
      await query(
        'UPDATE roleConfigs SET autoAssign = ?, requiresVerification = ? WHERE guildId = ? AND roleId = ?',
        [autoAssign, requiresVerification, guildId, roleId]
      );
    } else {
      // Insert
      await query(
        'INSERT INTO roleConfigs (guildId, roleId, autoAssign, requiresVerification) VALUES (?, ?, ?, ?)',
        [guildId, roleId, autoAssign, requiresVerification]
      );
    }

    const roles = await query(
      'SELECT * FROM roleConfigs WHERE guildId = ?',
      [guildId]
    );

    res.json(roles);
  } catch (error) {
    console.error('Error updating role config:', error);
    res.status(500).json({ error: 'Error al actualizar configuración de rol' });
  }
});

// Delete role config
router.delete('/:guildId/:roleId', authenticateToken, checkGuildPermissions, async (req, res) => {
  const { guildId, roleId } = req.params;

  try {
    await query(
      'DELETE FROM roleConfigs WHERE guildId = ? AND roleId = ?',
      [guildId, roleId]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting role config:', error);
    res.status(500).json({ error: 'Error al eliminar configuración de rol' });
  }
});

// Get user roles
router.get('/:guildId/users/:userId', authenticateToken, checkGuildPermissions, async (req, res) => {
  const { guildId, userId } = req.params;

  try {
    const roles = await query(
      'SELECT * FROM userRoles WHERE guildId = ? AND userId = ?',
      [guildId, userId]
    );

    res.json(roles);
  } catch (error) {
    console.error('Error fetching user roles:', error);
    res.status(500).json({ error: 'Error al obtener roles del usuario' });
  }
});

// Assign role to user
router.post('/:guildId/users/:userId', authenticateToken, checkGuildPermissions, async (req, res) => {
  const { guildId, userId } = req.params;
  const { roleId } = req.body;

  try {
    await query(
      'INSERT INTO userRoles (guildId, userId, roleId, assignedBy) VALUES (?, ?, ?, ?)',
      [guildId, userId, roleId, req.session.user?.id]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error assigning role:', error);
    res.status(500).json({ error: 'Error al asignar rol' });
  }
});

// Remove role from user
router.delete('/:guildId/users/:userId/:roleId', authenticateToken, checkGuildPermissions, async (req, res) => {
  const { guildId, userId, roleId } = req.params;

  try {
    await query(
      'DELETE FROM userRoles WHERE guildId = ? AND userId = ? AND roleId = ?',
      [guildId, userId, roleId]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error removing role:', error);
    res.status(500).json({ error: 'Error al quitar rol' });
  }
});

export default router;

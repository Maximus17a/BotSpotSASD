import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { checkGuildPermissions } from '../middleware/permissions';
import { query, queryOne } from '../utils/database';

const router = express.Router();

// Get all forms for a guild
router.get('/:guildId', authenticateToken, checkGuildPermissions, async (req, res) => {
  const { guildId } = req.params;

  try {
    const forms = await query<any>(
      'SELECT * FROM forms WHERE guildId = ? ORDER BY createdAt DESC',
      [guildId]
    );

    // Parse JSON fields
    forms.forEach(form => {
      form.fields = JSON.parse(form.fields || '[]');
    });

    res.json(forms);
  } catch (error) {
    console.error('Error fetching forms:', error);
    res.status(500).json({ error: 'Error al obtener formularios' });
  }
});

// Get a single form
router.get('/:guildId/:formId', authenticateToken, checkGuildPermissions, async (req, res) => {
  const { guildId, formId } = req.params;

  try {
    const form = await queryOne<any>(
      'SELECT * FROM forms WHERE id = ? AND guildId = ?',
      [formId, guildId]
    );

    if (!form) {
      return res.status(404).json({ error: 'Formulario no encontrado' });
    }

    form.fields = JSON.parse(form.fields || '[]');

    res.json(form);
  } catch (error) {
    console.error('Error fetching form:', error);
    res.status(500).json({ error: 'Error al obtener formulario' });
  }
});

// Create a new form
router.post('/:guildId', authenticateToken, checkGuildPermissions, async (req, res) => {
  const { guildId } = req.params;
  const { name, description, fields } = req.body;

  try {
    await query(
      'INSERT INTO forms (guildId, name, description, fields) VALUES (?, ?, ?, ?)',
      [guildId, name, description, JSON.stringify(fields)]
    );

    const forms = await query<any>(
      'SELECT * FROM forms WHERE guildId = ? ORDER BY createdAt DESC',
      [guildId]
    );

    forms.forEach(form => {
      form.fields = JSON.parse(form.fields || '[]');
    });

    res.json(forms);
  } catch (error) {
    console.error('Error creating form:', error);
    res.status(500).json({ error: 'Error al crear formulario' });
  }
});

// Update a form
router.put('/:guildId/:formId', authenticateToken, checkGuildPermissions, async (req, res) => {
  const { guildId, formId } = req.params;
  const { name, description, fields } = req.body;

  try {
    await query(
      'UPDATE forms SET name = ?, description = ?, fields = ? WHERE id = ? AND guildId = ?',
      [name, description, JSON.stringify(fields), formId, guildId]
    );

    const form = await queryOne<any>(
      'SELECT * FROM forms WHERE id = ? AND guildId = ?',
      [formId, guildId]
    );

    if (form) {
      form.fields = JSON.parse(form.fields || '[]');
    }

    res.json(form);
  } catch (error) {
    console.error('Error updating form:', error);
    res.status(500).json({ error: 'Error al actualizar formulario' });
  }
});

// Delete a form
router.delete('/:guildId/:formId', authenticateToken, checkGuildPermissions, async (req, res) => {
  const { guildId, formId } = req.params;

  try {
    await query(
      'DELETE FROM forms WHERE id = ? AND guildId = ?',
      [formId, guildId]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting form:', error);
    res.status(500).json({ error: 'Error al eliminar formulario' });
  }
});

export default router;

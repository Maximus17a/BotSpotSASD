import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { checkGuildPermissions } from '../middleware/permissions';
import { query } from '../utils/database';

const router = express.Router();

// Get all submissions for a guild
router.get('/:guildId', authenticateToken, checkGuildPermissions, async (req, res) => {
  const { guildId } = req.params;
  const { status } = req.query;

  try {
    let sql = 'SELECT * FROM formSubmissions WHERE guildId = ?';
    const params: any[] = [guildId];

    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }

    sql += ' ORDER BY createdAt DESC';

    const submissions = await query<any>(sql, params);

    // Parse JSON data field
    submissions.forEach(submission => {
      submission.data = JSON.parse(submission.data || '{}');
    });

    res.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Error al obtener envíos' });
  }
});

// Approve a submission
router.post('/:submissionId/approve', authenticateToken, async (req, res) => {
  const { submissionId } = req.params;
  const authReq = req as AuthRequest;

  try {
    await query(
      'UPDATE formSubmissions SET status = ?, reviewedBy = ?, reviewedAt = NOW() WHERE id = ?',
      ['approved', authReq.user?.id, submissionId]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error approving submission:', error);
    res.status(500).json({ error: 'Error al aprobar envío' });
  }
});

// Reject a submission
router.post('/:submissionId/reject', authenticateToken, async (req, res) => {
  const { submissionId } = req.params;
  const authReq = req as AuthRequest;

  try {
    await query(
      'UPDATE formSubmissions SET status = ?, reviewedBy = ?, reviewedAt = NOW() WHERE id = ?',
      ['rejected', authReq.user?.id, submissionId]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error rejecting submission:', error);
    res.status(500).json({ error: 'Error al rechazar envío' });
  }
});

export default router;

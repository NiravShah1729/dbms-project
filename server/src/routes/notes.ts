import express from 'express';
import { getNote, saveNote } from '../controllers/noteController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/:questionId', authenticateToken, getNote);
router.post('/', authenticateToken, saveNote);

export default router;

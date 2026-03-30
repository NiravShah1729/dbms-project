import { Router } from 'express';
import { toggleBookmark } from '../controllers/bookmarkController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/toggle', authenticateToken, toggleBookmark);

export default router;

import express from 'express';
import { getLeaderboard, getUserAnalytics } from '../controllers/statsController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/leaderboard', authenticateToken, getLeaderboard);
router.get('/analytics', authenticateToken, getUserAnalytics);

export default router;

import express from 'express';
import { getLeaderboard, getUserAnalytics, getMyStats, syncUserStats } from '../controllers/statsController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/leaderboard', authenticateToken, getLeaderboard);
router.get('/analytics', authenticateToken, getUserAnalytics);
router.get('/me', authenticateToken, getMyStats);
router.post('/sync', authenticateToken, syncUserStats);

export default router;

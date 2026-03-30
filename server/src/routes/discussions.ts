import express from 'express';
import { getDiscussions, createDiscussion, voteDiscussion } from '../controllers/discussionController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/:questionId', authenticateToken, getDiscussions);
router.post('/', authenticateToken, createDiscussion);
router.post('/:discussionId/vote', authenticateToken, voteDiscussion);

export default router;

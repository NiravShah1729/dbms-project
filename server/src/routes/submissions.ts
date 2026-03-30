import express from 'express';
import { getSubmissions, getAllSubmissions, createSubmission, verifySubmission } from '../controllers/submissionController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticateToken, getSubmissions);
router.get('/all', authenticateToken, getAllSubmissions);
router.post('/', authenticateToken, createSubmission);
router.post('/verify', authenticateToken, verifySubmission);

export default router;

import express from 'express';
import { getSubmissions, createSubmission } from '../controllers/submissionController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticateToken, getSubmissions);
router.post('/', authenticateToken, createSubmission);

export default router;

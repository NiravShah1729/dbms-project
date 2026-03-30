import express from 'express';
import { getQuestions, getQuestionById, createQuestion } from '../controllers/questionController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import { RoleName } from '../types';

const router = express.Router();

router.get('/', authenticateToken, getQuestions);
router.get('/:id', authenticateToken, getQuestionById);
router.post('/', authenticateToken, authorizeRoles([RoleName.ADMIN]), createQuestion);

export default router;

import { Response } from 'express';
import { executePool } from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';

export const getNote = async (req: AuthenticatedRequest, res: Response) => {
  const { questionId } = req.params;
  const currentUserId = req.user?.UserID;

  try {
    const sql = `
      SELECT Content, UpdatedAt
      FROM PersonalNote
      WHERE QuestionID = :questionId AND UserID = :currentUserId
    `;
    const result = await executePool<any>(sql, { questionId, currentUserId });
    
    if (result.rows && result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.json({ CONTENT: '', UPDATEDAT: null });
    }
  } catch (err: any) {
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

export const saveNote = async (req: AuthenticatedRequest, res: Response) => {
  const { QuestionID, Content } = req.body;
  const UserID = req.user?.UserID;

  try {
    const sql = `
      MERGE INTO PersonalNote target
      USING (SELECT :UserID as UserID, :QuestionID as QuestionID, :Content as Content FROM DUAL) source
      ON (target.UserID = source.UserID AND target.QuestionID = source.QuestionID)
      WHEN MATCHED THEN 
        UPDATE SET Content = source.Content, UpdatedAt = SYSTIMESTAMP
      WHEN NOT MATCHED THEN 
        INSERT (UserID, QuestionID, Content, UpdatedAt) VALUES (source.UserID, source.QuestionID, source.Content, SYSTIMESTAMP)
    `;
    await executePool(sql, { UserID, QuestionID, Content });
    res.status(200).json({ message: 'Note saved correctly' });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

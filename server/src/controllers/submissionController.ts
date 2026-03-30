import { Response } from 'express';
import { executePool } from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';

export const getSubmissions = async (req: AuthenticatedRequest, res: Response) => {
  const UserID = req.user?.UserID;
  try {
    const sql = `
      SELECT s.*, q.Title, v.Name as VerdictName
      FROM Submission s
      JOIN Question q ON s.QuestionID = q.QuestionID
      JOIN VerdictLookup v ON s.VerdictID = v.VerdictID
      WHERE s.UserID = :UserID
      ORDER BY s.SubmittedAt DESC
    `;
    const result = await executePool<any>(sql, { UserID });
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

export const createSubmission = async (req: AuthenticatedRequest, res: Response) => {
  const { QuestionID, VerdictName, SubmittedCode } = req.body;
  const UserID = req.user?.UserID;

  try {
    const vResult = await executePool<any>(`SELECT VerdictID FROM VerdictLookup WHERE Name = :VerdictName`, { VerdictName });
    const VerdictID = (vResult.rows as any)[0].VERDICTID;

    const sql = `
      INSERT INTO Submission (UserID, QuestionID, VerdictID, SubmittedCode)
      VALUES (:UserID, :QuestionID, :VerdictID, :SubmittedCode)
    `;
    await executePool(sql, { UserID, QuestionID, VerdictID, SubmittedCode });
    res.status(201).json({ message: 'Submission recorded' });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

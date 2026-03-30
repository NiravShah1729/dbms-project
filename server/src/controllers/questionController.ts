import { Request, Response } from 'express';
import { executePool } from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';

export const getQuestions = async (req: AuthenticatedRequest, res: Response) => {
  const { rating, tag, page = 1, limit = 20 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);
  const UserID = req.user?.UserID;

  try {
    let sql = `
      SELECT 
        q.QuestionID, 
        q.Title, 
        q.CF_Link, 
        q.Rating, 
        q.Tags, 
        q.IsVerified, 
        s.RefSolID,
        (SELECT v.Name 
         FROM Submission sub 
         JOIN VerdictLookup v ON sub.VerdictID = v.VerdictID 
         WHERE sub.QuestionID = q.QuestionID AND sub.UserID = :UserID
         ORDER BY sub.SubmittedAt DESC 
         FETCH NEXT 1 ROWS ONLY) as SolvedStatus
      FROM Question q 
      LEFT JOIN ReferenceSolution s ON q.QuestionID = s.QuestionID 
      WHERE 1=1 `;
    const binds: any = { UserID };

    if (rating) {
      sql += `AND q.Rating = :rating `;
      binds.rating = Number(rating);
    }
    if (tag) {
      sql += `AND q.Tags LIKE :tag `;
      binds.tag = `%${tag}%`;
    }

    sql += `ORDER BY q.Rating ASC, q.CreatedAt DESC OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY`;
    binds.offset = offset;
    binds.limit = Number(limit);

    console.log('[questions]: Executing SQL:', sql);
    console.log('[questions]: Binds:', JSON.stringify(binds));

    const result = await executePool<any>(sql, binds);
    console.log(`[questions]: Fetched ${result.rows?.length || 0} questions`);
    res.json(result.rows);
  } catch (err: any) {
    console.error('[questions]: Fetch error:', err.message);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

export const getQuestionById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const qSql = `SELECT * FROM Question WHERE QuestionID = :id`;
    const sSql = `SELECT * FROM ReferenceSolution WHERE QuestionID = :id`;
    
    const question = (await executePool<any>(qSql, { id })).rows?.[0];
    const solutions = (await executePool<any>(sSql, { id })).rows;

    if (!question) return res.status(404).json({ error: 'Question not found' });
    
    res.json({ ...question, solutions });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

export const createQuestion = async (req: AuthenticatedRequest, res: Response) => {
  const { CF_Link, Title, Rating, Tags, Hint, Solution } = req.body;
  const AdminID = req.user?.UserID;

  try {
    const qSql = `
      INSERT INTO Question (AdminID, CF_Link, Title, Rating, Tags, Hint)
      VALUES (:AdminID, :CF_Link, :Title, :Rating, :Tags, :Hint)
    `;
    await executePool(qSql, { AdminID, CF_Link, Title, Rating, Tags, Hint });

    if (Solution) {
      const getNewIdSql = `SELECT QuestionID FROM Question WHERE CF_Link = :CF_Link`;
      const qId = (await executePool<any>(getNewIdSql, { CF_Link })).rows?.[0].QUESTIONID;
      
      const sSql = `
        INSERT INTO ReferenceSolution (QuestionID, Description, CodeSnippet, Language)
        VALUES (:QuestionID, :Description, :CodeSnippet, :Language)
      `;
      await executePool(sSql, { 
        QuestionID: qId, 
        Description: 'Reference Solution', 
        CodeSnippet: Solution, 
        Language: 'cpp' 
      });
    }

    res.status(201).json({ message: 'Question created successfully' });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

export const deleteQuestion = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  try {
    const qSql = `DELETE FROM Question WHERE QuestionID = :id`;
    await executePool(qSql, { id });
    res.json({ message: 'Question deleted successfully' });
  } catch (err: any) {
    // This catch block will receive the ORA-20001 error from our trigger
    res.status(500).json({ error: 'Deletion failed.', details: err.message });
  }
};

export const updateQuestion = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { CF_Link, Title, Rating, Tags, Hint, Solution } = req.body;
  try {
    const qSql = `
      UPDATE Question 
      SET CF_Link = :CF_Link, Title = :Title, Rating = :Rating, Tags = :Tags, Hint = :Hint
      WHERE QuestionID = :id
    `;
    await executePool(qSql, { id, CF_Link, Title, Rating, Tags, Hint });

    if (Solution) {
      // Upsert reference solution
      const checkSolSql = `SELECT * FROM ReferenceSolution WHERE QuestionID = :id`;
      const existing = await executePool<any>(checkSolSql, { id });

      if (existing.rows?.length) {
        await executePool(`UPDATE ReferenceSolution SET CodeSnippet = :Solution WHERE QuestionID = :id`, { id, Solution });
      } else {
        await executePool(`INSERT INTO ReferenceSolution (QuestionID, Description, CodeSnippet, Language) VALUES (:id, 'Reference Solution', :Solution, 'cpp')`, { id, Solution });
      }
    }

    res.json({ message: 'Question updated successfully' });
  } catch (err: any) {
    res.status(500).json({ error: 'Update failed.', details: err.message });
  }
};

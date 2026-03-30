import { Response } from 'express';
import fetch from 'node-fetch';
import { executePool } from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';

export const getAllSubmissions = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const sql = `
      SELECT s.*, q.Title, v.Name as VerdictName, u.FullName, u.CF_Handle
      FROM Submission s
      JOIN Question q ON s.QuestionID = q.QuestionID
      JOIN VerdictLookup v ON s.VerdictID = v.VerdictID
      JOIN "User" u ON s.UserID = u.UserID
      ORDER BY s.SubmittedAt DESC
      FETCH NEXT 100 ROWS ONLY
    `;
    const result = await executePool<any>(sql);
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

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

export const verifySubmission = async (req: AuthenticatedRequest, res: Response) => {
  const { QuestionID, CF_Link } = req.body;
  const UserID = req.user?.UserID;

  try {
    // 1. Get user CF_Handle
    const userRes = await executePool<any>(`SELECT CF_Handle FROM "User" WHERE UserID = :UserID`, { UserID });
    const handle = (userRes.rows as any)[0]?.CF_HANDLE;
    if (!handle) return res.status(400).json({ error: 'Codeforces handle not linked' });

    // 2. Parse CF_Link (contestId and problemIndex)
    let contestId = '';
    let problemIndex = '';
    const contestMatch = CF_Link.match(/contest\/(\d+)\/problem\/([A-Z\d]+)/i);
    const problemsetMatch = CF_Link.match(/problemset\/problem\/(\d+)\/([A-Z\d]+)/i);

    if (contestMatch) {
      contestId = contestMatch[1];
      problemIndex = contestMatch[2];
    } else if (problemsetMatch) {
      contestId = problemsetMatch[1];
      problemIndex = problemsetMatch[2];
    }

    if (!contestId || !problemIndex) return res.status(400).json({ error: 'Invalid Codeforces link' });

    // 3. Fetch status from Codeforces
    const cfUrl = `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=50`;
    const cfRes = await fetch(cfUrl);
    const cfData: any = await cfRes.json();

    if (cfData.status !== 'OK') {
      const isNotFound = cfData.comment?.toLowerCase().includes('not found');
      return res.status(isNotFound ? 404 : 502).json({ 
        error: isNotFound ? 'Codeforces handle not found' : 'Codeforces API error', 
        details: cfData.comment 
      });
    }

    // 4. Look for latest submission for THIS problem
    const submission = cfData.result.find((s: any) => 
      s.contestId.toString() === contestId && s.problem.index.toUpperCase() === problemIndex.toUpperCase()
    );

    if (!submission) return res.status(404).json({ error: 'No submission found for this problem on Codeforces.' });

    // Map CF verdict to our database VerdictLookup
    const cfVerdict = submission.verdict;
    let verdictName = 'WA';
    if (cfVerdict === 'OK') verdictName = 'AC';
    else if (cfVerdict === 'TIME_LIMIT_EXCEEDED') verdictName = 'TLE';
    else if (cfVerdict === 'MEMORY_LIMIT_EXCEEDED') verdictName = 'MLE';
    else if (cfVerdict === 'COMPILATION_ERROR') verdictName = 'CE';

    // 5. Insert into Submission table with CF_SubmissionID tracking
    const vResult = await executePool<any>(`SELECT VerdictID FROM VerdictLookup WHERE Name = :verdictName`, { verdictName });
    const VerdictID = (vResult.rows as any)[0]?.VERDICTID;

    const insertSql = `
      INSERT INTO Submission (UserID, QuestionID, VerdictID, SubmittedCode, CF_SubmissionID)
      VALUES (:UserID, :QuestionID, :VerdictID, :SubmittedCode, :CF_SubmissionID)
    `;
    
    try {
      await executePool(insertSql, { 
        UserID, 
        QuestionID, 
        VerdictID, 
        SubmittedCode: `CF submission ID: ${submission.id}`,
        CF_SubmissionID: submission.id
      });
    } catch (dbErr: any) {
      // If it's a unique constraint error (ORA-00001), it means it's already recorded
      if (dbErr.message.includes('ORA-00001')) {
        console.log('[verifySubmission]: Submission already recorded.');
      } else {
        throw dbErr;
      }
    }

    res.json({ 
      success: true, 
      verdict: verdictName, 
      submissionId: submission.id 
    });
  } catch (err: any) {
    console.error('[verifySubmission]:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

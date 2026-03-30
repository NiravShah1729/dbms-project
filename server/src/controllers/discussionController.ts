import { Response } from 'express';
import { executePool } from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';

export const getDiscussions = async (req: AuthenticatedRequest, res: Response) => {
  const { questionId } = req.params;
  const currentUserId = req.user?.UserID;

  try {
    const sql = `
      SELECT d.*, u.FullName, u.CF_Handle,
             (SELECT COUNT(*) FROM Vote v WHERE v.DiscussionID = d.DiscussionID AND v.Value = 1) as Upvotes,
             (SELECT COUNT(*) FROM Vote v WHERE v.DiscussionID = d.DiscussionID AND v.Value = -1) as Downvotes,
             (SELECT Value FROM Vote v WHERE v.DiscussionID = d.DiscussionID AND v.UserID = :currentUserId) as UserVote,
             p.Text as ParentText, pu.FullName as ParentAuthor, pu.CF_Handle as ParentCFHandle, p.CreatedAt as ParentCreatedAt
      FROM Discussion d
      JOIN "User" u ON d.UserID = u.UserID
      LEFT JOIN Discussion p ON d.ParentID = p.DiscussionID
      LEFT JOIN "User" pu ON p.UserID = pu.UserID
      WHERE d.QuestionID = :questionId
      ORDER BY d.CreatedAt DESC
    `;
    const result = await executePool<any>(sql, { questionId, currentUserId });
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

export const createDiscussion = async (req: AuthenticatedRequest, res: Response) => {
  const { QuestionID, Text, ParentID } = req.body;
  const UserID = req.user?.UserID;

  try {
    const parentIdVal = ParentID || null;
    const sql = `INSERT INTO Discussion (QuestionID, UserID, Text, ParentID) VALUES (:QuestionID, :UserID, :Text, :ParentID)`;
    await executePool(sql, { QuestionID, UserID, Text, ParentID: parentIdVal });
    res.status(201).json({ message: 'Discussion posted' });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

export const voteDiscussion = async (req: AuthenticatedRequest, res: Response) => {
  const { discussionId } = req.params;
  const { value } = req.body; // 1 or -1
  const UserID = req.user?.UserID;

  try {
    const sql = `
      MERGE INTO Vote target
      USING (SELECT :UserID as UserID, :discussionId as DiscussionID, :value as Value FROM DUAL) source
      ON (target.UserID = source.UserID AND target.DiscussionID = source.DiscussionID)
      WHEN MATCHED THEN UPDATE SET Value = source.Value
      WHEN NOT MATCHED THEN INSERT (UserID, DiscussionID, Value) VALUES (source.UserID, source.DiscussionID, source.Value)
    `;
    await executePool(sql, { UserID, discussionId, value });
    res.json({ message: 'Vote recorded' });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

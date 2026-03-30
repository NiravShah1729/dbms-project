import { Response } from 'express';
import { executePool } from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';

export const getLeaderboard = async (req: AuthenticatedRequest, res: Response) => {
  const currentUserId = req.user?.UserID;

  try {
    // 1. Recompute ranks before fetching
    await executePool(`BEGIN sp_recompute_ranks; END;`);

    // 2. Fetch top 50
    const topSql = `
      SELECT us.*, u.FullName, u.CF_Handle
      FROM UserStats us
      JOIN "User" u ON us.UserID = u.UserID
      ORDER BY us.TotalSolved DESC
      FETCH NEXT 50 ROWS ONLY
    `;
    const topResult = await executePool<any>(topSql);

    // 3. Fetch current user specific stats
    const userSql = `
      SELECT us.*, u.FullName, u.CF_Handle
      FROM UserStats us
      JOIN "User" u ON us.UserID = u.UserID
      WHERE us.UserID = :currentUserId
    `;
    const userResult = await executePool<any>(userSql, { currentUserId });

    res.json({
      top: topResult.rows,
      user: (userResult.rows as any)?.[0] || null
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

export const getUserAnalytics = async (req: AuthenticatedRequest, res: Response) => {
  const UserID = req.user?.UserID;

  try {
    // Heatmap data
    const heatmapSql = `
      SELECT TRUNC(SubmittedAt) as submission_date, COUNT(*) as "count"
      FROM Submission
      WHERE UserID = :UserID
      GROUP BY TRUNC(SubmittedAt)
      ORDER BY submission_date
    `;
    const heatmap = await executePool<any>(heatmapSql, { UserID });

    // Progress by rating
    const ratingSql = `
      SELECT q.Rating, COUNT(DISTINCT s.QuestionID) as solved_count,
             (SELECT COUNT(*) FROM Question WHERE Rating = q.Rating) as total_count
      FROM Submission s
      JOIN Question q ON s.QuestionID = q.QuestionID
      JOIN VerdictLookup v ON s.VerdictID = v.VerdictID
      WHERE s.UserID = :UserID AND v.Name = 'AC'
      GROUP BY q.Rating
      ORDER BY q.Rating
    `;
    const ratingProgress = await executePool<any>(ratingSql, { UserID });

    res.json({ heatmap: heatmap.rows, ratingProgress: ratingProgress.rows });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

import { Response } from 'express';
import { executePool } from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';

export const toggleBookmark = async (req: AuthenticatedRequest, res: Response) => {
  const { QuestionID } = req.body;
  const UserID = req.user?.UserID;

  if (!QuestionID || !UserID) {
    return res.status(400).json({ error: 'QuestionID is required' });
  }

  try {
    // Check if the bookmark exists
    const checkSql = `SELECT BookmarkID FROM Bookmark WHERE UserID = :UserID AND QuestionID = :QuestionID`;
    const checkResult = await executePool<any>(checkSql, { UserID, QuestionID });

    if (checkResult.rows && checkResult.rows.length > 0) {
      // Bookmark exists, so remove it
      const deleteSql = `DELETE FROM Bookmark WHERE UserID = :UserID AND QuestionID = :QuestionID`;
      await executePool(deleteSql, { UserID, QuestionID });
      return res.json({ isBookmarked: false, message: 'Bookmark removed' });
    } else {
      // Bookmark doesn't exist, so add it
      const insertSql = `INSERT INTO Bookmark (UserID, QuestionID) VALUES (:UserID, :QuestionID)`;
      await executePool(insertSql, { UserID, QuestionID });
      return res.json({ isBookmarked: true, message: 'Bookmark added' });
    }
  } catch (err: any) {
    console.error('Toggle bookmark error:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

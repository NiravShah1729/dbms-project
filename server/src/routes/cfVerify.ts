import express, { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { executePool } from '../config/db';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { verifyCFHandle } from '../services/cfService';

const router = express.Router();

router.post('/getToken', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const UserID = req.user?.UserID;
  const token = uuidv4();

  try {
    await executePool(
      `MERGE INTO CFVerificationToken target
       USING (SELECT :UserID as UserID, :token as Token FROM DUAL) source
       ON (target.UserID = source.UserID)
       WHEN MATCHED THEN UPDATE SET Token = source.Token, CreatedAt = SYSTIMESTAMP
       WHEN NOT MATCHED THEN INSERT (UserID, Token) VALUES (source.UserID, source.Token)`,
      { UserID, token }
    );
    res.json({ token });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

router.post('/verify', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const UserID = req.user?.UserID;
  const { handle } = req.body;

  try {
    const result = await executePool<any>(`SELECT Token FROM CFVerificationToken WHERE UserID = :UserID`, { UserID });
    const storedToken = (result.rows as any)?.[0]?.TOKEN;

    if (!storedToken) return res.status(400).json({ error: 'No token generated. Generate a token first.' });

    const isVerified = await verifyCFHandle(handle, storedToken);
    if (isVerified) {
      await executePool(`UPDATE "User" SET CF_Handle = :handle, IsVerified = 1 WHERE UserID = :UserID`, { handle, UserID });
      res.json({ message: 'Profile verified successfully!' });
    } else {
      res.status(400).json({ error: 'Token not found in profile About section.' });
    }
  } catch (err: any) {
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

export default router;

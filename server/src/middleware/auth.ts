import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { RoleName } from '../types';

interface AuthRequest extends Request {
  user?: {
    UserID: number;
    Email: string;
    Roles: RoleName[];
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, process.env.JWT_SECRET as string, (err, user: any) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

export const authorizeRoles = (roles: RoleName[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    
    const hasRole = req.user.Roles.some(role => roles.includes(role));
    if (!hasRole) return res.status(403).json({ error: 'Insufficient permissions' });
    
    next();
  };
};

export interface AuthenticatedRequest extends AuthRequest {}

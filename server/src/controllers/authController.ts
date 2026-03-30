import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { executePool } from '../config/db';
import { RoleName } from '../types';

export const register = async (req: Request, res: Response) => {
  const { FullName, Email, Password, CF_Handle } = req.body;
  
  if (!FullName || !Email || !Password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const passwordHash = await bcrypt.hash(Password, 10);
    
    // 1. Insert user
    const userResult = await executePool<any>(
      `INSERT INTO "User" (FullName, Email, PasswordHash, CF_Handle) 
       VALUES (:FullName, :Email, :PasswordHash, :CF_Handle) 
       RETURNING UserID INTO :id`,
      { FullName, Email, passwordHash, CF_Handle, id: { type: 2002 /* Number */, dir: 3003 /* Out */ } }
    );
    
    // In node-oracledb, RETURNING INTO works slightly differently, 
    // but the above is a simplification. Let's use a normal INSERT and then fetch the ID if needed, 
    // or use the 'outBind' from executePool correctly.
    // For simplicity with strictly normalized schema, we fetch the default 'user' role.
    
    const findRoleSql = `SELECT RoleID FROM Role WHERE RoleName = :roleName`;
    const roleResult = await executePool<any>(findRoleSql, { roleName: RoleName.USER });
    const userRoleId = (roleResult.rows as any)[0].ROLEID;
    
    // Need the New User ID
    const fetchUserIdSql = `SELECT UserID FROM "User" WHERE Email = :email`;
    const userIdResult = await executePool<any>(fetchUserIdSql, { email: Email });
    const newUserId = (userIdResult.rows as any)[0].USERID;

    // 2. Assign default role
    await executePool(
      `INSERT INTO UserRole (UserID, RoleID) VALUES (:UserID, :RoleID)`,
      { UserID: newUserId, RoleID: userRoleId }
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err: any) {
    if (err.errorNum === 1) return res.status(400).json({ error: 'Email already exists' });
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { Email, Password } = req.body;

  try {
    const sql = `
      SELECT u.*, LISTAGG(r.RoleName, ',') WITHIN GROUP (ORDER BY r.RoleName) as Roles
      FROM "User" u
      JOIN UserRole ur ON u.UserID = ur.UserID
      JOIN Role r ON ur.RoleID = r.RoleID
      WHERE u.Email = :Email
      GROUP BY u.UserID, u.FullName, u.Email, u.PasswordHash, u.CF_Handle, u.IsVerified
    `;
    
    const result = await executePool<any>(sql, { Email });
    const user = (result.rows as any)[0];

    if (!user || !(await bcrypt.compare(Password, user.PASSWORDHASH))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const roles = user.ROLES.split(',') as RoleName[];
    const token = jwt.sign(
      { UserID: user.USERID, Email: user.EMAIL, Roles: roles },
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        UserID: user.USERID,
        FullName: user.FULLNAME,
        Email: user.EMAIL,
        CF_Handle: user.CF_HANDLE,
        IsVerified: user.ISVERIFIED === 1,
        Roles: roles
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

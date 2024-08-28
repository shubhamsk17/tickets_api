import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Ensure that you use environment variables for sensitive information
const secret = process.env.JWT_SECRET || 'your_jwt_secret';

interface CustomRequest extends Request {
  user?: { userId: number; type: string };
}

export async function authenticateToken(req: CustomRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401); // Unauthorized if no token

  try {
    const user = jwt.verify(token, secret) as { userId: number; type: string };
    req.user = user;
    next();
  } catch (err) {
    return res.sendStatus(403); // Forbidden if token is invalid or expired
  }
}

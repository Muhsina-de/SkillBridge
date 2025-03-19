import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    console.log('Auth headers:', req.headers); // Debug log
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log('No authorization header found'); // Debug log
      return res.status(401).json({ message: 'No authorization header' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      console.log('No token found in authorization header'); // Debug log
      return res.status(401).json({ message: 'No token provided' });
    }

    console.log('Received token:', token); // Debug log
    const secret = process.env.JWT_SECRET || 'test-secret';
    console.log('Using JWT secret:', secret); // Debug log

    const decoded = jwt.verify(token, secret) as { id: number; email: string };
    console.log('Decoded token:', decoded); // Debug log

    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error); // Debug log
    return res.status(401).json({ message: 'Invalid token' });
  }
};
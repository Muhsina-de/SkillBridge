import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    console.log("TOKEnPASSES!")

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-fallback-secret') as {
      id: number;
      email: string;
    };
    
    // Add user info to request object
    req.user = decoded;
    // console.log("reqUser", req.user);
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET as string; 

export const generateToken = (userId: number) => {
  return jwt.sign({ userId }, secret, { expiresIn: '1h' });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};
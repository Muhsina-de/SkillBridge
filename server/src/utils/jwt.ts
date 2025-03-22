import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET as string; 

export const generateToken = (userId: number, email: string) => {
  return jwt.sign({ id: userId, email }, secret, { expiresIn: '24h' });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};
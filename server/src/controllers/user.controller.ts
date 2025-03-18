import { Request, Response } from 'express';
import { User } from '../models/user';
import { generateToken } from '../utils/jwt';

export const signUp = async (req: Request, res: Response) => {
  try {
    const { username, email, password,  role } = req.body;
   //check if user with same email already exists
    const exit = await User.findOne({ where: { email } });
            
            if (exit) {
              return res.status(400).json({ message: 'User already exists' });
            }
            
    const newUser = await User.create({username, email, password, role});
    return res.status(201).json({ message: 'User created successfully' });
  

  } catch (error) {
    const errorMessage = (error as Error).message;
    res.status(500).json({ error: errorMessage });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.validatePassword(password))) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const token = generateToken(user.id);
    res.status(200).json({ 
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    res.status(500).json({ error: errorMessage });
  }
};




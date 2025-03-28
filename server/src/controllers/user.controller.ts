import { Response } from 'express';
import User from '../models/user';
import { generateToken } from '../utils/jwt';
import bcrypt from 'bcryptjs';
import { AuthRequest } from '../types/express';

export const signUp = async (req: AuthRequest, res: Response) => {        
  try {
    const { username, email, password, role } = req.body;

    // Check if user with same email already exists
    const existingUser = await User.findOne({ where: { email } });    
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user with required fields
    const newUser = await User.create({
      username,
      email,
      password,
      role: role || 'mentee', // Default to mentee if no role specified
      profilePicture: undefined // Optional field
    });

    return res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    const errorMessage = (error as Error).message;
    res.status(500).json({ error: errorMessage });
  }
};

export const login = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Compare password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const token = generateToken(user.id, user.email);
    res.status(200).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    res.status(500).json({ error: errorMessage });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { username, bio, skills, location, availability } = req.body;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update({
      username,
      bio,
      skills,
      location,
      availability
    });

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        bio: user.bio,
        skills: user.skills,
        location: user.location,
        availability: user.availability
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    await user.update({ password: newPassword });
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ message: 'Error changing password' });
  }
};
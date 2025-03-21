import { User } from '../models/user';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config';
import { SignOptions } from 'jsonwebtoken';

const getUserProfile = async (req: Request, res: Response) => {
    try {
        const profiles = await User.findAll();
        res.json(profiles);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch profiles' });
    }
    };

const getProfileById = async (req: Request, res: Response) => {
    try {
        const profile = await User.findByPk(req.params.id);
        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }
        res.json(profile);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
    }

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user with required fields
    const user = await User.create({
      username,
      email,
      password,  // Password will be hashed by the model's beforeCreate hook
      role: role || 'mentee', // Default to mentee if no role specified
      profilePicture: undefined // Optional field
    });

    // Generate JWT token with string expiration
    const token = jwt.sign(
      { id: user.id, email: user.email },
      Buffer.from(config.JWT_SECRET),
      { expiresIn: '24h' } // Use string format for expiration
    );

    // Return user info and token (excluding password)
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture
    };

    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password using the model's validatePassword method
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token with string expiration
    const token = jwt.sign(
      { id: user.id, email: user.email },
      Buffer.from(config.JWT_SECRET),
      { expiresIn: '24h' } // Use string format for expiration
    );

    // Return user info and token (excluding password)
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture
    };

    res.json({
      message: 'Login successful',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error during login' });
  }
};

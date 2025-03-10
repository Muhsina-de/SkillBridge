import { User } from '../models/userprofile';
import { Request, Response } from 'express';

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

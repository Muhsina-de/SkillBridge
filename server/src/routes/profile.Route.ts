import express from 'express';
import { User } from '../models';
import { authenticateJWT } from '../middleware/authmiddleware';

const router = express.Router();

// Get all profiles
router.get('/', authenticateJWT, async (req, res) => {
    try {
        const profiles = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        res.json(profiles);
    } catch (error) {
        console.error('Error fetching profiles:', error);
        res.status(500).json({ message: 'Failed to fetch profiles', error: error instanceof Error ? error.message : 'Unknown error' });
    }
});

// Get all mentors
router.get('/mentors', authenticateJWT, async (req, res) => {
    try {
        console.log('Fetching mentors...');
        const mentors = await User.findAll({
            where: { role: 'mentor' },
            attributes: { exclude: ['password'] }
        });
        console.log(`Found ${mentors.length} mentors:`, mentors.map(m => ({ id: m.id, username: m.username, email: m.email })));
        res.json(mentors);
    } catch (error) {
        console.error('Error fetching mentors:', error);
        if (error instanceof Error) {
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });
        }
        res.status(500).json({ 
            message: 'Failed to fetch mentors', 
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Get profile by ID
router.get('/:id', authenticateJWT, async (req, res) => {
    try {
        const profile = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] }
        });
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.json(profile);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Failed to fetch profile', error: error instanceof Error ? error.message : 'Unknown error' });
    }
});

// Update profile
router.put('/:id', authenticateJWT, async (req, res) => {
    try {
        const profile = await User.findByPk(req.params.id);
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        await profile.update(req.body);
        res.json(profile);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Failed to update profile', error: error instanceof Error ? error.message : 'Unknown error' });
    }
});

// Create new profile
router.post('/', authenticateJWT, async (req, res) => {
    try {
        const profile = await User.create(req.body);
        res.status(201).json(profile);
    } catch (error) {
        console.error('Error creating profile:', error);
        res.status(500).json({ message: 'Failed to create profile', error: error instanceof Error ? error.message : 'Unknown error' });
    }
});

export default router;
import express from 'express';
import { User } from '../models/userprofile';
import { auth } from '../middleware/auth';

const router = express.Router();

//sign in user

router.get('/', auth, async (req, res) => {
  try {
    const profiles = await User.findAll();
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profiles' });
  }
});

// Get a profile by id
router.get('/:id', auth, async (req, res) => {
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
});

// Update a profile
router.put('/:id', auth, async (req, res) => {
  try {
    const profile = await User.findByPk(req.params.id);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    const { username, email, bio, skills, role, rating, profilePicture, availability, location, linkedin, github, twitter } = req.body;
    await profile.update({ username, email, bio, skills, role, rating, profilePicture, availability, location, linkedin, github, twitter });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
}
);

// Create a new profile
router.post('/', auth, async (req, res) => {
  try {
    const { username, email, bio } = req.body;
    const newProfile = await User.create({
        username, email, bio,
        password: '',
        skills: [],
        role: '',
        rating: 0,
        profilePicture: '',
        availability: [],
        location: '',
        linkedin: '',
        github: '',
        twitter: ''
    });
    res.status(201).json(newProfile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create profile' });
  }
});

export default router;
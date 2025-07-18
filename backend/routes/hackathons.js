const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Hackathon = require('../models/Hackathon');

// Create hackathon (organizer only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'organizer') {
      return res.status(403).json({ message: 'Only organisers can add hackathons' });
    }
    const hackathon = new Hackathon({ ...req.body, organiser: req.user._id });
    await hackathon.save();
    res.status(201).json(hackathon);
  } catch (error) {
    res.status(400).json({ message: 'Error creating hackathon', error: error.message });
  }
});

// Get all hackathons (authenticated users only)
router.get('/', auth, async (req, res) => {
  try {
    const hackathons = await Hackathon.find().populate('organiser', 'username email');
    res.json(hackathons);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching hackathons', error: error.message });
  }
});

// Get hackathon by ID (authenticated users only)
router.get('/:id', auth, async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id).populate('organiser', 'username email');
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }
    res.json(hackathon);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching hackathon', error: error.message });
  }
});

// Update hackathon (organizer only, own hackathons only)
router.patch('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'organizer') {
      return res.status(403).json({ message: 'Only organisers can update hackathons' });
    }
    
    const hackathon = await Hackathon.findOneAndUpdate(
      { _id: req.params.id, organiser: req.user._id },
      req.body,
      { new: true }
    );
    
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found or not authorized' });
    }
    
    res.json(hackathon);
  } catch (error) {
    res.status(400).json({ message: 'Error updating hackathon', error: error.message });
  }
});

// Delete hackathon (organizer only, own hackathons only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'organizer') {
      return res.status(403).json({ message: 'Only organisers can delete hackathons' });
    }
    
    const hackathon = await Hackathon.findOneAndDelete({
      _id: req.params.id,
      organiser: req.user._id
    });
    
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found or not authorized' });
    }
    
    res.json({ message: 'Hackathon deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting hackathon', error: error.message });
  }
});

module.exports = router;

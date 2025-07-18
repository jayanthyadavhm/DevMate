const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Hackathon = require('../models/Hackathon');

// Mark user as ready for a hackathon
router.post('/ready', auth, async (req, res) => {
  const { hackathonId } = req.body;
  if (!hackathonId) return res.status(400).json({ message: 'hackathonId required' });
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { readyHackathons: hackathonId } },
      { new: true }
    );
    res.json({ message: 'Marked as ready', user });
  } catch (err) {
    res.status(500).json({ message: 'Error marking ready', error: err.message });
  }
});

// List users ready for a hackathon
router.get('/ready/:hackathonId', auth, async (req, res) => {
  try {
    const users = await User.find({ readyHackathons: req.params.hackathonId }, 'username email');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching ready users', error: err.message });
  }
});

// Send join request to another user for a hackathon
router.post('/join-request', auth, async (req, res) => {
  const { toUserId, hackathonId } = req.body;
  if (!toUserId || !hackathonId) return res.status(400).json({ message: 'toUserId and hackathonId required' });
  try {
    // For simplicity, store join requests in user doc (production: use a separate model)
    await User.findByIdAndUpdate(toUserId, {
      $push: { joinRequests: { from: req.user._id, hackathon: hackathonId } }
    });
    res.json({ message: 'Join request sent' });
  } catch (err) {
    res.status(500).json({ message: 'Error sending join request', error: err.message });
  }
});

// List join requests for current user
router.get('/join-requests', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('joinRequests.from', 'username email').populate('joinRequests.hackathon', 'name');
    res.json(user.joinRequests || []);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching join requests', error: err.message });
  }
});

// Get all users ready for any hackathon (for finding teammates)
router.get('/ready-users', auth, async (req, res) => {
  try {
    const users = await User.find({ 
      readyHackathons: { $exists: true, $ne: [] },
      _id: { $ne: req.user._id } // Exclude current user
    }, 'username email firstName lastName university skills bio profilePicture hackathonExperience location')
      .populate('readyHackathons', 'name');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching ready users', error: err.message });
  }
});

// Accept a join request
router.post('/accept-request/:requestId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const request = user.joinRequests.id(req.params.requestId);
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    request.status = 'accepted';
    await user.save();
    
    // TODO: Create a team or add to existing team
    res.json({ message: 'Request accepted', request });
  } catch (err) {
    res.status(500).json({ message: 'Error accepting request', error: err.message });
  }
});

// Reject a join request
router.post('/reject-request/:requestId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const request = user.joinRequests.id(req.params.requestId);
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    request.status = 'rejected';
    await user.save();
    
    res.json({ message: 'Request rejected', request });
  } catch (err) {
    res.status(500).json({ message: 'Error rejecting request', error: err.message });
  }
});

// Update user profile
router.patch('/profile', auth, async (req, res) => {
  try {
    const allowedUpdates = [
      'firstName', 'lastName', 'university', 'major', 'yearOfStudy', 
      'bio', 'skills', 'portfolioUrl', 'githubUrl', 'linkedinUrl', 
      'location', 'hackathonExperience', 'preferredTeamSize', 
      'availability', 'interests'
    ];
    
    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });
    
    const user = await User.findByIdAndUpdate(req.user._id, updates, { 
      new: true, 
      runValidators: true 
    }).select('-password');
    
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: 'Error updating profile', error: err.message });
  }
});

// Get user profile
router.get('/profile/:userId?', auth, async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;
    const user = await User.findById(userId)
      .select('-password')
      .populate('readyHackathons', 'name date')
      .populate('joinedHackathons.hackathon', 'name date status');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile', error: err.message });
  }
});

module.exports = router;

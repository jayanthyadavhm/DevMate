const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');

// Create project
router.post('/', auth, async (req, res) => {
    try {
        const project = new Project({
            ...req.body,
            owner: req.user._id
        });
        await project.save();
        res.status(201).json(project);
    } catch (error) {
        res.status(400).json({ message: 'Error creating project', error: error.message });
    }
});

// Get all projects for user
router.get('/', auth, async (req, res) => {
    try {
        const projects = await Project.find({
            $or: [
                { owner: req.user._id },
                { members: req.user._id }
            ]
        }).populate('owner', 'username email');
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching projects', error: error.message });
    }
});

// Get project by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('owner', 'username email')
            .populate('members', 'username email');
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching project', error: error.message });
    }
});

// Update project
router.patch('/:id', auth, async (req, res) => {
    try {
        const project = await Project.findOneAndUpdate(
            { _id: req.params.id, owner: req.user._id },
            req.body,
            { new: true }
        );
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(project);
    } catch (error) {
        res.status(400).json({ message: 'Error updating project', error: error.message });
    }
});

// Delete project
router.delete('/:id', auth, async (req, res) => {
    try {
        const project = await Project.findOneAndDelete({ 
            _id: req.params.id,
            owner: req.user._id
        });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting project', error: error.message });
    }
});

// Add member to project
router.post('/:id/members', auth, async (req, res) => {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            owner: req.user._id
        });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        const { memberId } = req.body;
        if (project.members.includes(memberId)) {
            return res.status(400).json({ message: 'Member already added' });
        }
        
        project.members.push(memberId);
        await project.save();
        res.json(project);
    } catch (error) {
        res.status(400).json({ message: 'Error adding member', error: error.message });
    }
});

module.exports = router;

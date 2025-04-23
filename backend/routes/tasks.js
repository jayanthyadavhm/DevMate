const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Project = require('../models/Project');
const auth = require('../middleware/auth');

// Create task
router.post('/', auth, async (req, res) => {
    try {
        const project = await Project.findById(req.body.project);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if user is project owner or member
        if (!project.owner.equals(req.user._id) && !project.members.includes(req.user._id)) {
            return res.status(403).json({ message: 'Not authorized to create tasks in this project' });
        }

        const task = new Task({
            ...req.body,
            project: project._id
        });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: 'Error creating task', error: error.message });
    }
});

// Get all tasks for a project
router.get('/project/:projectId', auth, async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (!project.owner.equals(req.user._id) && !project.members.includes(req.user._id)) {
            return res.status(403).json({ message: 'Not authorized to view tasks' });
        }

        const tasks = await Task.find({ project: req.params.projectId })
            .populate('assignedTo', 'username email');
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', error: error.message });
    }
});

// Get task by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('assignedTo', 'username email')
            .populate('project', 'name');
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const project = await Project.findById(task.project);
        if (!project.owner.equals(req.user._id) && !project.members.includes(req.user._id)) {
            return res.status(403).json({ message: 'Not authorized to view this task' });
        }

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching task', error: error.message });
    }
});

// Update task
router.patch('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const project = await Project.findById(task.project);
        if (!project.owner.equals(req.user._id) && !project.members.includes(req.user._id)) {
            return res.status(403).json({ message: 'Not authorized to update this task' });
        }

        Object.assign(task, req.body);
        await task.save();
        res.json(task);
    } catch (error) {
        res.status(400).json({ message: 'Error updating task', error: error.message });
    }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const project = await Project.findById(task.project);
        if (!project.owner.equals(req.user._id)) {
            return res.status(403).json({ message: 'Only project owner can delete tasks' });
        }

        await task.remove();
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task', error: error.message });
    }
});

// Get tasks assigned to current user
router.get('/my/tasks', auth, async (req, res) => {
    try {
        const tasks = await Task.find({ assignedTo: req.user._id })
            .populate('project', 'name')
            .sort({ dueDate: 1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', error: error.message });
    }
});

module.exports = router;

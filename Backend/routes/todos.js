const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const authMiddleware = require('../middleware/auth');

// Get all todos for a user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const todos = await Todo.find({ user: req.user.userId });
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching todos' });
    }
});

// Create a new todo
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { title, description } = req.body;
        const todo = new Todo({
            title,
            description,
            user: req.user.userId
        });
        await todo.save();
        res.status(201).json(todo);
    } catch (error) {
        res.status(500).json({ message: 'Error creating todo' });
    }
});

// Update a todo
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const todo = await Todo.findOneAndUpdate(
            { _id: req.params.id, user: req.user.userId },
            req.body,
            { new: true }
        );
        if (!todo) return res.status(404).json({ message: 'Todo not found' });
        res.json(todo);
    } catch (error) {
        res.status(500).json({ message: 'Error updating todo' });
    }
});

// Delete a todo
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const todo = await Todo.findOneAndDelete({ 
            _id: req.params.id, 
            user: req.user.userId 
        });
        if (!todo) return res.status(404).json({ message: 'Todo not found' });
        res.json({ message: 'Todo deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting todo' });
    }
});

module.exports = router;
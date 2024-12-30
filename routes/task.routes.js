const express = require('express');
const router = express.Router();
const Task = require('../models/task.model');
const taskController = require('../controllers/task.controller');
const auth = require('../middleware/auth');

router.use(auth);

// Get all tasks
router.get('/', taskController.getTasks);

// Create task
router.post('/', taskController.createTask);

// Update task
router.put('/:id', taskController.updateTask);

// Delete task
router.delete('/:taskId', taskController.deleteTask);

// Comment routes
router.post('/:id/comments', taskController.addComment);
router.delete('/:taskId/comments/:commentId', taskController.deleteComment);

module.exports = router; 
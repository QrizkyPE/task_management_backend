const Task = require('../models/task.model');

// Get all tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id })
      .populate({
        path: 'labels',
        select: 'name color description'
      })
      .exec();
    
    // console.log('Tasks with populated labels:', JSON.stringify(tasks, null, 2));
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single task
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.taskId, user: req.user._id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Create task
exports.createTask = async (req, res) => {
  try {
    const task = new Task({
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority,
      status: req.body.status,
      dueDate: req.body.dueDate,
      categoryId: req.body.categoryId,
      labels: req.body.labels,
      user: req.user._id
    });

    let newTask = await task.save();
    
    // Populate the labels after save
    newTask = await newTask.populate({
      path: 'labels',
      select: 'name color description'
    });

    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(400).json({ message: error.message });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    const updates = {
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority,
      status: req.body.status,
      dueDate: req.body.dueDate,
      categoryId: req.body.categoryId,
      labels: req.body.labels
    };

    let task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updates,
      { new: true }
    );

    // Populate the labels after update
    task = await task.populate({
      path: 'labels',
      select: 'name color description'
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    console.log('Updated task with populated labels:', JSON.stringify(task, null, 2));
    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(400).json({ message: error.message });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.taskId, user: req.user._id });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add comment to task
exports.addComment = async (req, res) => {
  try {
    console.log('Adding comment - Request:', {
      params: req.params,
      body: req.body,
      user: req.user
    });

    const task = await Task.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!task) {
      console.log('Task not found');
      return res.status(404).json({ message: 'Task not found' });
    }

    const comment = {
      content: req.body.text,
      user: req.user._id,
      username: req.user.username,
      createdAt: new Date()
    };

    console.log('New comment object:', comment);
    task.comments.push(comment);
    await task.save();

    console.log('Task updated with comment');
    res.json(task);
  } catch (error) {
    console.error('Error adding comment:', error.message);
    res.status(400).json({ message: error.message });
  }
};

// Delete comment from task
exports.deleteComment = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Find the comment index
    const commentIndex = task.comments.findIndex(
      comment => comment._id.toString() === req.params.commentId
    );
    
    if (commentIndex === -1) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is comment owner
    if (task.comments[commentIndex].user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    // Remove the comment using pull
    task.comments.pull({ _id: req.params.commentId });
    await task.save();

    console.log('Comment deleted:', req.params.commentId);
    console.log('Updated task:', task);

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(400).json({ message: error.message });
  }
}; 
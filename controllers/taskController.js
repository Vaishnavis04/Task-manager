const { sendTaskAssignmentEmail } = require('../utils/emailService');
const Task = require('../models/Task');
const User = require('../models/User');

// Admin - create task
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, assignedTo } = req.body;
    const user = await User.findById(assignedTo);
    if (!user) return res.status(404).json({ message: 'Assigned user not found' });

    const task = new Task({
      title,
      description,
      dueDate,
      assignedTo,
    });

    await task.save();
     if (user.email) {
      await sendTaskAssignmentEmail(user.email, user.username, task);
    }
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin - get all tasks
// Admin - get all tasks with optional sorting
exports.getAllTasks = async (req, res) => {
  try {
    const { sortBy } = req.query;

    let sortOptions = {};

    if (sortBy === 'priority') {
      // Sort priority manually in frontend after fetch or change priority to numbers in DB
      sortOptions = { priority: 1 }; // alphabetical: high, low, medium
    } else if (sortBy === 'dueDate') {
      sortOptions = { dueDate: 1 }; // ascending
    }

    const tasks = await Task.find()
      .populate('assignedTo', 'username')
      .sort(sortOptions);

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// User - get own tasks
exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// User - update task status
exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['assigned', 'open', 'pending', 'completed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (task.assignedTo.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized to update this task' });

    task.status = status;
    await task.save();
     // Notify user about status update via email
    const user = await User.findById(req.user.id);
    if (user.email) {
      await sendTaskStatusUpdateEmail(user.email, user.username, task);
    }
    res.json(task);
  } catch (err) {
    console.error('Error updating task status:', err.message);
    res.status(500).json({ message: 'Server error while updating task status' });
  }
};
// Admin - delete any task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
//updateTask by admin
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update allowed fields
    const { title, description, dueDate, assignedTo, status } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;
    if (status !== undefined) task.status = status;

    await task.save();
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


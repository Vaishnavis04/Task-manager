const express = require('express');
const router = express.Router();
const {
  createTask,
  getAllTasks,
  deleteTask,
  getMyTasks,
  updateTaskStatus,
  updateTask
} = require('../controllers/taskController');
const auth = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');

// Admin routes
// Admin routes
router.post('/', auth, isAdmin, createTask);
router.get('/', auth, isAdmin, getAllTasks);
router.delete('/:id', auth, isAdmin, deleteTask);
router.put('/:id', auth, isAdmin, updateTask); // ✅ Correct if mounted at /api/tasks
// User routes
router.get('/my-tasks', auth, getMyTasks);
router.put('/:id/status', auth, updateTaskStatus);

module.exports = router;

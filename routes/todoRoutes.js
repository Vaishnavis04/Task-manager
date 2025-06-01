const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getMyTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleSubtask,
  toggleTodoComplete,
   deleteSubtask,
   editSubtask,
} = require('../controllers/todoController');

// All routes require user to be authenticated
router.get('/my-todos', authMiddleware, getMyTodos);
router.post('/', authMiddleware, createTodo);
router.put('/:id', authMiddleware, updateTodo);
router.delete('/:id', authMiddleware, deleteTodo);
router.patch('/:todoId/subtasks/:subtaskIndex/toggle', authMiddleware, toggleSubtask);
router.patch('/:id/toggleComplete', authMiddleware, toggleTodoComplete);
router.delete('/:todoId/subtasks/:subtaskIndex', authMiddleware, deleteSubtask);
router.put('/:todoId/subtasks/:subtaskIndex/edit', authMiddleware, editSubtask);

module.exports = router;

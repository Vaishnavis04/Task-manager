const Todo = require('../models/Todo');

// Get all todos for the authenticated user
exports.getMyTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch todos' });
  }
};

// Create a new todo
exports.createTodo = async (req, res) => {
  const { title, description, priority, dueDate, subtasks } = req.body;

  try {
    const newTodo = await Todo.create({
      user: req.user.id,
      title,
      description,
      priority,
      dueDate,
      subtasks,
    });

    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create todo', error: err.message });
  }
};


// Update a todo
exports.updateTodo = async (req, res) => {
  const { title, description, priority, dueDate, subtasks } = req.body;

  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title, description, priority, dueDate, subtasks },
      { new: true }
    );
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update todo', error: err.message });
  }
};


// Delete a todo
exports.deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findOneAndDelete({ _id: id, user: req.user.id });

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found or not authorized' });
    }

    res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete todo' });
  }
};
exports.toggleSubtask = async (req, res) => {
  const { todoId, subtaskIndex } = req.params;
  try {
    const todo = await Todo.findOne({ _id: todoId, user: req.user.id });
    if (!todo) return res.status(404).json({ message: 'Todo not found' });

    todo.subtasks[subtaskIndex].completed = !todo.subtasks[subtaskIndex].completed;
    await todo.save();

    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Failed to toggle subtask' });
  }
};
// Toggle completion of the entire todo
exports.toggleTodoComplete = async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user.id });
    if (!todo) return res.status(404).json({ message: 'Todo not found' });

    todo.completed = !todo.completed;
    await todo.save();

    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Failed to toggle todo completion' });
  }
};
// Delete a specific subtask
exports.deleteSubtask = async (req, res) => {
  const { todoId, subtaskIndex } = req.params;

  try {
    const todo = await Todo.findOne({ _id: todoId, user: req.user.id });
    if (!todo) return res.status(404).json({ message: 'Todo not found' });

    // Remove subtask by index
    todo.subtasks.splice(subtaskIndex, 1);
    await todo.save();

    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete subtask' });
  }
};
// PATCH /api/todos/:todoId/subtasks/:subtaskIndex/edit
exports.editSubtask = async (req, res) => {
  const { todoId, subtaskIndex } = req.params;
  const { newText } = req.body;

  try {
    const todo = await Todo.findOne({ _id: todoId, user: req.user.id });
    if (!todo) return res.status(404).json({ message: 'Todo not found' });

    if (!todo.subtasks[subtaskIndex]) {
      return res.status(400).json({ message: 'Subtask does not exist' });
    }

    todo.subtasks[subtaskIndex].text = newText;
    await todo.save();

    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Failed to edit subtask' });
  }
};

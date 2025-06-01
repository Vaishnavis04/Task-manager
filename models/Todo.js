// const mongoose = require('mongoose');

// const todoSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   title: { type: String, required: true },
//   description: { type: String, default: '' },
// }, { timestamps: true });

// module.exports = mongoose.model('Todo', todoSchema);
const mongoose = require('mongoose');

const subtaskSchema = new mongoose.Schema({
  title: String,
  completed: { type: Boolean, default: false }
});

const todoSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: String,
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  dueDate: Date,
  subtasks: [subtaskSchema],
}, {
  timestamps: true
});

module.exports = mongoose.model('Todo', todoSchema);

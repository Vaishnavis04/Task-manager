const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  dueDate: Date,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['assigned', 'open', 'pending', 'completed'], default: 'assigned' },
});

module.exports = mongoose.model('Task', taskSchema);

const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide the name of the task'],
    maxlength: [50, 'Task name cannot exceed 50 characters'],
  },
  description: {
    type: String,
    maxlength: [100, 'Task description cannot exceed 100 characters'],
  },
});

module.exports = mongoose.model('Task', TaskSchema);

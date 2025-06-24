const mongoose = require('mongoose');
const { use } = require('../config/emailConfig');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  enabled: { type: Boolean, default: true },
 
   
});

module.exports = mongoose.model('User', userSchema);

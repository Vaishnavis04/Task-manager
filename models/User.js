const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
   enabled: { type: Boolean, default: true },
   email: { type: String, unique: true, sparse: true }, 
});

module.exports = mongoose.model('User', userSchema);

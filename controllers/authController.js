const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendWelcomeEmail,sendResetPasswordEmail } = require('../utils/emailService');

// ✅ Signup
exports.signup = async (req, res) => {
  const { email, password, username } = req.body;  // <-- Added username here
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      username,           // <-- Add username here
      password: hashedPassword,
      role: 'user',
      enabled: true,
    });

    await sendWelcomeEmail(email);
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log("LOGIN ATTEMPT:", email, password);

  try {
    const user = await User.findOne({ email });
    console.log("USER FOUND:", user);

    if (!user || !user.enabled)
      return res.status(404).json({ message: "User not found or disabled" });

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("PASSWORD MATCH:", isMatch);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({ email: user.email, role: user.role, token });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};


// ✅ Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // exclude password
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Update user role (admin only)
exports.updateUserRole = async (req, res) => {
  const { userId, newRole } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = newRole;
    await user.save();

    res.json({ message: `User role updated to ${newRole}` });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update role' });
  }
};
// Update user role by userId param
// exports.updateUserRoleByParam = async (req, res) => {
//   const { userId } = req.params;
//   const { newRole } = req.body;

//   try {
//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     user.role = newRole;
//     await user.save();

//     res.json({ message: `User role updated to ${newRole}` });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to update role' });
//   }
// };

// Update user status (enable/disable)
exports.updateUserStatus = async (req, res) => {
  const { userId } = req.params;
  const { enabled } = req.body; // boolean

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.enabled = enabled; // You need to add 'enabled' field to User schema if not already present
    await user.save();

    res.json({ message: `User has been ${enabled ? 'enabled' : 'disabled'}` });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user status' });
  }
};

// Delete user by ID
exports.deleteUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

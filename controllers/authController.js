const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendWelcomeEmail } = require('../utils/emailService');

// ✅ Signup: Create user, return message (no token)
exports.signup = async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: "Username already taken" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      password: hashedPassword,
      email,   // Make sure User schema has email field if you want to save it
      role: 'user',
      enabled: true,
    });

    // Send welcome email if email provided
    if (email) {
      await sendWelcomeEmail(email, username);
    }

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




// ✅ Login: Authenticate and return JWT + role
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      username: user.username,
      role: user.role,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
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

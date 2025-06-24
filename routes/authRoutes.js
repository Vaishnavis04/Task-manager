const express = require('express');
const { signup, login,
  getAllUsers, updateUserRole,
  updateUserStatus,
  deleteUserById,
 } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/all-users', authMiddleware, isAdmin, getAllUsers);

// PUT /users/update-role
router.put('/update-role', authMiddleware, isAdmin, updateUserRole);


// Update status (enable/disable) for a specific user by ID
router.put('/users/:userId/status', authMiddleware, isAdmin, updateUserStatus);

// Delete a user by ID
router.delete('/users/:userId', authMiddleware, isAdmin, deleteUserById);
module.exports = router;

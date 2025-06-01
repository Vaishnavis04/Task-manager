const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware'); // JWT verify
const isAdmin = require('../middleware/isAdmin');

// Admin Routes
router.post('/admin', authMiddleware, isAdmin, createProduct);
router.put('/admin/:id', authMiddleware, isAdmin, updateProduct);
router.delete('/admin/:id', authMiddleware, isAdmin, deleteProduct);

// Public (User) Route
router.get('/', getProducts);

module.exports = router;

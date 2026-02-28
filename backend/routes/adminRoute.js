const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin, getProfile } = require('../controllers/adminController');
const protect = require('../middleware/authMid');

// Public routes
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// Protected route
router.get('/profile', protect, getProfile);

module.exports = router;
const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin, getProfile, verifyEmail } = require('../controllers/adminController');
const protect = require('../middleware/authMid');


// Public routes
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/verify', verifyEmail);

// Protected route
router.get('/profile', protect, getProfile);

module.exports = router;
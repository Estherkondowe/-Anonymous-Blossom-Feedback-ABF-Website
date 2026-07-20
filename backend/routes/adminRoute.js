const express = require('express');
const router = express.Router();
const {loginAdmin, getProfile,} = require('../controllers/adminController');
const protect = require('../middleware/authMid');


// Public routes
router.post('/login', loginAdmin);


// Protected route
router.get('/profile', protect, getProfile);

module.exports = router;
const express = require('express');
const router = express.Router();
const { submitFeedback, getAllFeedback, deleteFeedback } = require('../controllers/feedbackController');
const protect = require('../middleware/authMid');

// Public route
router.post('/', submitFeedback);

// Admin routes
router.get('/', protect, getAllFeedback);
router.delete('/:id', protect, deleteFeedback);

module.exports = router;
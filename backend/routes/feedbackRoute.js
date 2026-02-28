const express = require('express');
const router = express.Router();
const { submitFeedback, getAllFeedback, deleteFeedback } = require('../controllers/feedbackController');

// Public route
router.post('/', submitFeedback);

// Admin routes
router.get('/', getAllFeedback);
router.delete('/:id', deleteFeedback);

module.exports = router;
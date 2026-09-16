const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMid');
const {
    createForm,
    getForms,
    getFormResponses,
    deleteForm
} = require('../controllers/formController');

router.post('/create', protect, createForm);
router.get('/', protect, getForms);
router.get('/:formId/responses', protect, getFormResponses);
router.delete('/:formId', protect, deleteForm);

module.exports = router;
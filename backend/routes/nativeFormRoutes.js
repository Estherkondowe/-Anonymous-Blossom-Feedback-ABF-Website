const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const protect = require('../middleware/authMid');
const c = require('../controllers/nativeFormController');

const submitLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => res.status(429).json({ error: 'Too many submissions. Please slow down.' })
});

router.get('/portal', c.publicPortal);

router.get('/public/:slug', c.getPublicFormBySlug);
router.post('/public/:slug/respond', submitLimiter, c.submitResponse);

router.post('/', protect, c.createForm);
router.get('/', protect, c.myForms);
router.get('/:id', protect, c.getForm);
router.patch('/:id', protect, c.updateForm);
router.delete('/:id', protect, c.softDelete);
router.post('/:id/duplicate', protect, c.duplicateForm);
router.get('/:id/responses', protect, c.getResponses);
router.get('/:id/responses/export', protect, c.exportCsv);

module.exports = router;
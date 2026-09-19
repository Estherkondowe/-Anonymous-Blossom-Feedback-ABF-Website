const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { requestMagicLink, verifyMagicLink, getMe, logout } = require('../controllers/authController');
const protect = require('../middleware/authMid');
const { setAuthToken } = require('../utils/authCookie');

const magicLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many sign-in attempts. Please try again later.' }
});

router.post('/magic/request', magicLimiter, requestMagicLink);
router.get('/magic/verify', verifyMagicLink);
router.post('/logout', logout);
router.get('/me', protect, getMe);

router.get('/google', passport.authenticate('google', {
    scope: [
        'profile',
        'email',
        'https://www.googleapis.com/auth/forms.body',
        'https://www.googleapis.com/auth/forms.responses.readonly'
    ],
    accessType: 'offline',
    prompt: 'consent'
}));

router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: `${process.env.FRONTEND_URL}/login?error=unauthorized`,
        session: false
    }),
    (req, res) => {
        try {
            const token = jwt.sign(
                { id: req.user._id, email: req.user.email, role: req.user.role },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );
            setAuthToken(res, token);
            res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
        } catch (err) {
            console.error('Google callback error:', err.message);
            res.redirect(`${process.env.FRONTEND_URL}/login?error=server`);
        }
    }
);

module.exports = router;
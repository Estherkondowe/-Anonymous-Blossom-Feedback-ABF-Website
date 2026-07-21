const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const jwt = require('jsonwebtoken');

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: `${process.env.FRONTEND_URL}/login?error=unauthorized`,
        session: false
    }),
    (req, res) => {
        try {
            const token = jwt.sign(
                { id: req.user._id, email: req.user.email },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${token}`);

        } catch (err) {
            console.error(err);
            res.redirect(`${process.env.FRONTEND_URL}/login?error=server`);
        }
    }
);

module.exports = router;
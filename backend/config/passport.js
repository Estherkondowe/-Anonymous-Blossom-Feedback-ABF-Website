const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Admin = require('../models/admin');

console.log("GOOGLE_CALLBACK_URL =", process.env.GOOGLE_CALLBACK_URL);
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    proxy: true
},
async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value;

        const allowedEmails = ['kondoweesther2@gmail.com'];
        if (!email.endsWith('@code-blossom.com') && !allowedEmails.includes(email)) {
            return done(null, false, { message: 'Only Code Blossom emails allowed' });
        }

        let admin = await Admin.findOne({ email });

        if (!admin) {
            admin = new Admin({
                email,
                password: 'google-auth',
                role: 'admin'
            });
            await admin.save();
        }

        return done(null, admin);

    } catch (err) {
        return done(err, null);
    }
}));

passport.serializeUser((admin, done) => {
    done(null, admin.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const admin = await Admin.findById(id);
        done(null, admin);
    } catch (err) {
        done(err, null);
    }
});

module.exports = passport;

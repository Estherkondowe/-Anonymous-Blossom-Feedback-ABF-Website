const express = require('express');
require('dotenv').config();
const connectToDb = require('./config/db_connection');
const feedbackRoutes = require('./routes/feedbackRoute');
const adminRoutes = require('./routes/adminRoute');
const cors = require('cors');
const passport = require('./config/passport');
const session = require('express-session');
const authRoute = require('./routes/authRoute');
const formRoutes = require('./routes/formRoutes');
const nativeFormRoutes = require('./routes/nativeFormRoutes');
const seedUniversalForm = require('./utils/seedUniversalForm');
const cookieParser = require('cookie-parser');
const app = express();
app.set('trust proxy', 1);
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'https://blossom-feedback.vercel.app'],
  credentials: true
}));

app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());

app.use(express.static('public'));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

 //routes
 // Keep Render awake
app.get('/ping', (req, res) => {
    res.json({ status: 'awake' });
});
 app.use('/api/feedback', feedbackRoutes);
 app.use('/api/admin', adminRoutes);
 app.use('/api/auth', authRoute);
 app.use('/api/forms', formRoutes);
 app.use('/api/native', nativeFormRoutes);

async function startServer() {
    try {
        await connectToDb();
        await seedUniversalForm();

        app.listen(process.env.PORT, () => {
            console.log('Server has started listening to port ' + process.env.PORT);
        });
    } catch (err) {
        console.error('Failed to start server:', err.message);
        process.exit(1);
    }
}

startServer();
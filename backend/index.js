const express= require('express');
require('dotenv').config();
const connectToDb= require('./config/db_connection');
const feedbackRoutes= require('./routes/feedbackRoute')
const adminRoutes= require('./routes/adminRoute')
const cors= require('cors')
const passport = require('./config/passport');
const session = require('express-session');
const authRoute = require('./routes/authRoute');

const app= express();


 app.use(express.json());
 app.use(cors({origin: ['http://localhost:3001','https://blossom-voices.netlify.app'],
    credentials: true
 }));

 app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
 
 //routes
 app.use('/api/feedback', feedbackRoutes);
 app.use('/api/admin', adminRoutes);
 app.use('/api/auth', authRoute);



async function startServer() {
    await connectToDb();   
    
    app.listen( process.env.PORT, ()=>{
        console.log("Server has started listening to port "+ process.env.PORT)
    })
}

startServer();





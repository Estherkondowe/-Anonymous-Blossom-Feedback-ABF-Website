const express= require('express');
require('dotenv').config();
const connectToDb= require('./config/db_connection');
const feedbackRoutes= require('./routes/feedbackRoute')
const adminRoutes= require('./routes/adminRoute')
const cors= require('cors')
const app= express();


app.use(express.json());
// Allow localhost, existing Netlify preview, and a configured FRONTEND_URL (e.g. Vercel)
const allowedOrigins = ['http://localhost:3001', 'https://blossom-voices.netlify.app'];
if (process.env.FRONTEND_URL) allowedOrigins.push(process.env.FRONTEND_URL);
app.use(cors({ origin: allowedOrigins }));
 
 //routes
 app.use('/api/feedback', feedbackRoutes);
 app.use('/api/admin', adminRoutes);



async function startServer() {
    await connectToDb();   
    
    app.listen( process.env.PORT, ()=>{
        console.log("Server has started listening to port "+ process.env.PORT)
    })
}

startServer();





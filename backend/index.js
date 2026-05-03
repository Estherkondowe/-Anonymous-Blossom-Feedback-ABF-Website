const express= require('express');
require('dotenv').config();
const connectToDb= require('./config/db_connection');
const feedbackRoutes= require('./routes/feedbackRoute')
const adminRoutes= require('./routes/adminRoute')
const cors= require('cors')
const app= express();


 app.use(express.json());
 app.use(cors({origin: ['http://localhost:3001','https://blossom-voices.netlify.app']}));
 
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





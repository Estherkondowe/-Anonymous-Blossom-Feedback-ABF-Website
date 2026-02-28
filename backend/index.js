const express= require('express');
require('dotenv').config();
const connectToDb= require('./config/db_connection');
const feedbackRoutes= require('./routes/feedbackRoute')
const adminRoutes= require('./routes/adminRoute')
const app= express();

 app.use(express.json());
 
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





const express= require('express');
require('dotenv').config();
const connectToDb= require('./config/db_connection');
const app= express();





async function startServer() {
    await connectToDb();   
    
    app.listen( process.env.PORT, ()=>{
        console.log("Server has started listening to port "+ process.env.PORT)
    })
}

startServer();





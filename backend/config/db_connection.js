const mongoose = require('mongoose')
require('dotenv').config();


const url= process.env.DB_URL;

async function connectToDb() {
    try {
      await mongoose.connect(url);
      console.log('Connected to the database successifuly!');
    } catch (error) {
      console.error('Database connection error:', error);

      process.exit(1); 
    }
  }
  
  module.exports= connectToDb;
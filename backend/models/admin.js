const mongoose= require('mongoose');

const adminSchema= new  mongoose.Schema({
    email:{
        type:String,
        required: true,
        unique: true,
        
    },
    password:{
        type: String,
        required:true,


    },
    role:{
        type: String,
        default:"admin",

    },
    googleAccessToken:{
        type: String,
    },
    googleRefreshToken:{
        type: String,
    },
     
})
module.exports= mongoose.model('admin', adminSchema);
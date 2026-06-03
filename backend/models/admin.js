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
     isVerified: {
        type: Boolean,
        default: false,  
    },
    confirmationToken: {
        type: String,      
    },
    tokenExpiry: {
        type: Date,        
    }
})
module.exports= mongoose.model('admin', adminSchema);
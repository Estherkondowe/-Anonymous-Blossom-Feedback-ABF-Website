const mongoose =require('mongoose');

const feedbackSchema = new  mongoose.Schema({
    session:{
        type: String,
        required:true

    },
    mentor:{
        type:String,
        required:true

    },
    message:{
        type:String,
        required:true,
    },
    rating:{
        type:Number,
        required:false,
        min:1,
        max:5


    }, sentiment:{
        type:String,
        enum:['positive', 'neutral', 'negative'],
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
      }

})
module.exports =mongoose.model('feedback', feedbackSchema);
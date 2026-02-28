const Feedback =require('../models/feedback');

//feedback submission
const submitFeedback= async(req,res)=>{
    try{
        const {session, mentor, message, rating}=req.body;

        if(!session ||!message){
            return res.status(400).json({error:'session and messages are required'})
        }
        const feedback = new Feedback({session, mentor, message, rating});
        await feedback.save();
        res.status(201).json({message:"yay feedback submitted successifully"})
    }
    catch(err){
        res.status(500).json({error:"oops server error"})
    }
};

const getAllFeedback = async (req, res) => {
    try {
      const feedbacks = await Feedback.find().sort({ createdAt: -1 });
      res.json(feedbacks);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  const deleteFeedback = async (req, res) => {
    try {
      const { id } = req.params;
      await Feedback.findByIdAndDelete(id);
      res.json({ message: 'Feedback deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  };

  module.exports= {submitFeedback, getAllFeedback, deleteFeedback};
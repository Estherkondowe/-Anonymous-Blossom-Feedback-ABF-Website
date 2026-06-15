const Admin =require('../models/admin');
const bcrypt =require('bcrypt');
const jwt =require('jsonwebtoken');
const crypto = require('crypto');
const sendConfirmationEmail=require('../config/emailService');

//registering the adminn/code blossom mentors
    const registerAdmin = async (req, res)=>{
    try{
        const {email, password}= req.body;

        if (!email || !password)
            return res.status(400).json({ error: 'Email and password required' });

        const testEmails = process.env.TEST_EMAILS
                    ? process.env.TEST_EMAILS.split(',').map(e => e.trim())
                    : [];

        const isAllowed = email.endsWith('@code-blossom.com') || testEmails.includes(email);

                if (!isAllowed)
                    return res.status(403).json({ error: 'Only Code Blossom emails are allowed' });
            
        const existing = await Admin.findOne({ email });
          if (existing) return res.status(400).json({ error: 'Admin already exists' });
      

        //confirmation token generation code
        const confirmationToken= crypto.randomBytes(32).toString('hex');
        const tokenExpiry= new Date(Date.now() + 24*60*60*1000);

          const hashedPassword = await bcrypt.hash(password, 10);
      
        // saving code blossom admin before verification of their email
        const admin = new Admin({
            email,
            password: hashedPassword,
            isVerified: false,
            confirmationToken,
            tokenExpiry,
        });
        await admin.save();

    // sending email code
        try {
        await sendConfirmationEmail(email, confirmationToken);

        console.log('confirmation email sent to:', email);

        } catch (emailErr) {
        console.error('email sending failed:', emailErr.message);
        
        await Admin.deleteOne({ email });
        return res.status(500).json({ error: 'Failed to send confirmation email. Please try again.' });
        }
        
    res.status(201).json({message:'Registration successiful! Please check your email to confirm your account 🌸'});
    }catch(err){
        console.error(err);
        res.status(500).json({error:'server error'})
    }
  };
   // verify email function
   const verifyEmail= async (req, res) =>{
        try{
            const {token} = req.params;
            const admin=await Admin.findOne({
                confirmationToken:token,
                tokenExpiry: {$gt: new Date()}
            });
            if(!admin){
                return res.status(400).json({error:'Invalid or expired verification link'});
            }

        admin.isVerified = true;
        admin.confirmationToken = undefined;
        admin.tokenExpiry = undefined;
        await admin.save();

        res.redirect(`${process.env.FRONTEND_URL}/login?verified=true`);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
   };
   // Login Admin function
    const loginAdmin = async (req, res) => {
        try {
            const { email, password } = req.body;

            const admin = await Admin.findOne({ email });
            if (!admin) return res.status(400).json({ error: 'Invalid credentials' });

            // Checking if email is verified
            if (!admin.isVerified) {
                return res.status(400).json({
                    error: 'Please verify your email before logging in. Check your inbox 🌸'
                });
            }

            const match = await bcrypt.compare(password, admin.password);
            if (!match) return res.status(400).json({ error: 'Invalid credentials' });

            const token = jwt.sign(
                { id: admin._id, email: admin.email },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

        res.json({ message: 'Login successful', token });

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
        };

    // Get Profile function
        const getProfile = async (req, res) => {
            try {
                const admin = await Admin.findById(req.admin.id).select('-password');
                res.json(admin);
            } catch (err) {
                res.status(500).json({ error: 'Server error' });
            }
        };





    
 module.exports = { registerAdmin, verifyEmail, loginAdmin, getProfile };
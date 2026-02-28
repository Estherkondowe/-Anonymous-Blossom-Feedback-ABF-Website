const Admin =require('../models/admin');
const bcrypt =require('bcrypt');
const jwt =require('jsonwebtoken');

//registering the adminn
const registerAdmin = async (req, res)=>{
    try{
        const {email, password}= req.body;

        if (!email || !password)
            return res.status(400).json({ error: 'Email and password required' });
      
          const existing = await Admin.findOne({ email });
          if (existing) return res.status(400).json({ error: 'Admin already exists' });
      
          const hashedPassword = await bcrypt.hash(password, 10);
      
          const admin = new Admin({ email, password: hashedPassword });
          await admin.save();
      
          res.status(201).json({ message: 'Admin registered successfully' });
        } catch (err) {
          res.status(500).json({ error: 'Server error' });
        }
    };

    const loginAdmin = async (req, res) => {
        try {
          const { email, password } = req.body;
      
          const admin = await Admin.findOne({ email });
          if (!admin) return res.status(400).json({ error: 'Invalid credentials' });
      
          const match = await bcrypt.compare(password, admin.password);
          if (!match) return res.status(400).json({ error: 'Invalid credentials' });
      
          // Implementation of  JWT
          const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
      
          res.json({ message: 'Login successful', token });
        } catch (err) {
          res.status(500).json({ error: 'Server error' });
        }
      };
      
      // 3. Admin profile 
      const getProfile = async (req, res) => {
        try {
          const admin = await Admin.findById(req.admin.id).select('-password');
          res.json(admin);
        } catch (err) {
          res.status(500).json({ error: 'Server error' });
        }
      };
      
      module.exports = { registerAdmin, loginAdmin, getProfile };
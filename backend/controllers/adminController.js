const Admin =require('../models/admin');
const bcrypt =require('bcrypt');
const jwt =require('jsonwebtoken');

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





    
 module.exports = { loginAdmin, getProfile };
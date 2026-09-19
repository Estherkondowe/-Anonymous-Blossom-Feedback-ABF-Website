const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');
const isAllowedEmail = require('../utils/allowedEmail');
const { setAuthToken, clearAuthToken } = require('../utils/authCookie');

const ALLOWED_ADMIN_EMAILS = ['kondoweesther2@gmail.com'];

function defaultRoleFor(email) {
  return ALLOWED_ADMIN_EMAILS.includes(email) ? 'owner' : 'mentor';
}

const requestMagicLink = async (req, res) => {
  const { email } = req.body;
  const normalized = typeof email === 'string' ? email.trim().toLowerCase() : '';

  if (!normalized || !isAllowedEmail(normalized)) {
    return res.status(400).json({ error: 'That email is not allowed to sign in.' });
  }

  try {
    const token = jwt.sign(
      { email: normalized, purpose: 'magic' },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const loginUrl = `${process.env.FRONTEND_URL}/magic?token=${token}`;

    if (process.env.RESEND_API_KEY) {
      const { Resend } = require('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.EMAIL_FROM || 'ABF <onboarding@resend.dev>',
        to: normalized,
        subject: '🌸 Your ABF sign-in link',
        html: `
          <p>Hi there,</p>
          <p>Here is your sign-in link for <strong>Anonymous Blossom Feedback</strong>. It expires in 15 minutes.</p>
          <p><a href="${loginUrl}">Sign in to ABF</a></p>
          <p>If you didn't request this, you can safely ignore this email.</p>
        `
      });
    } else {
      console.log(`[magic-link] RESEND_API_KEY not set — link for ${normalized}: ${loginUrl}`);
    }

    res.json({ message: 'If that email is allowed, a sign-in link has been sent. 🌸' });
  } catch (err) {
    console.error('magic link send error:', err.message);
    res.status(500).json({ error: 'Failed to send sign-in link. Please try again.' });
  }
};

const verifyMagicLink = async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.purpose !== 'magic') {
      throw new Error('Invalid token purpose');
    }

    const email = String(decoded.email).toLowerCase();
    let admin = await Admin.findOne({ email });

    if (!admin) {
      admin = await Admin.create({ email, isVerified: true, active: true, role: defaultRoleFor(email) });
    } else if (!admin.active) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=inactive`);
    } else {
      admin.isVerified = true;
      admin.role = defaultRoleFor(email);
      await admin.save();
    }

    const sessionToken = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    setAuthToken(res, sessionToken);
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  } catch (err) {
    res.redirect(`${process.env.FRONTEND_URL}/login?error=invalid_link`);
  }
};

const getMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('email name role active');
    if (!admin) return res.status(404).json({ error: 'User not found' });
    res.json({ user: admin });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const logout = (req, res) => {
  clearAuthToken(res);
  res.json({ message: 'Logged out successfully' });
};

module.exports = { requestMagicLink, verifyMagicLink, getMe, logout };
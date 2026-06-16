const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendConfirmationEmail = async (email, token) => {
    const confirmationUrl = `${process.env.BACKEND_URL}/api/admin/verify?token=${token}`;

    await resend.emails.send({
        from: 'ABF <onboarding@resend.dev>',
        to: email,
        subject: '🌸 Confirm Your ABF Admin Account',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #e91e8c;">🌸 Anonymous Blossom Feedback</h1>
                <h2>Confirm Your Admin Account</h2>
                <p>Thank you for registering as an ABF admin!</p>
                <p>Please click the button below to confirm your email address and activate your account.</p>
                <a href="${confirmationUrl}" 
                   style="background-color: #e91e8c; 
                          color: white; 
                          padding: 14px 25px; 
                          text-decoration: none; 
                          border-radius: 8px;
                          display: inline-block;
                          margin: 20px 0;">
                    Confirm My Account
                </a>
                <p>This link will expire in <strong>24 hours.</strong></p>
                <p>If you did not register for ABF, please ignore this email.</p>
                <br/>
                <p style="color: #e91e8c;">🌸 Anonymous Blossom Feedback</p>
                <p style="color: #888; font-size: 12px;">Built for Code Blossom</p>
            </div>
        `
    });
};

module.exports = sendConfirmationEmail;
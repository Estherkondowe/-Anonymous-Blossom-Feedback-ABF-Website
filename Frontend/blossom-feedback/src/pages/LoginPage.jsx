import { useState } from 'react';
import api from '../api';
import { BACKEND_URL } from '../config';
import './AdminLogin.css';
import './LoginPage.css';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [sending, setSending] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const searchParams = new URLSearchParams(window.location.search);
    const errorParam = searchParams.get('error');

    const errorText = {
        unauthorized: 'Wrong account! Please switch to your allowed Code Blossom email.',
        server: 'Something went wrong. Please try again.',
        invalid_link: 'That sign-in link is invalid or expired. Request a new one.',
        inactive: 'This account has been deactivated. Contact the coordinator.'
    };

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        if (!email.trim()) {
            setError('Please enter your email');
            return;
        }
        setSending(true);
        setError('');
        setMessage('');
        try {
            const data = await api.post('/api/auth/magic/request', { email });
            setMessage(data.message || 'Check your inbox for a sign-in link. 🌸');
        } catch (err) {
            setError(err.message);
        } finally {
            setSending(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${BACKEND_URL}/api/auth/google`;
    };

    return (
        <div className='login-container'>
            <div className='login-card'>
                <div className='login-header'>
                    <h1>🌸 Mentor Login</h1>
                    <p>Sign in to create and manage your feedback forms</p>
                </div>

                <form onSubmit={handleEmailLogin}>
                    <div className='form-group'>
                        <label>Work email</label>
                        <input
                            type='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='you@code-blossom.com'
                            autoComplete='email'
                        />
                    </div>
                    <button type='submit' className='login-btn' disabled={sending}>
                        {sending ? 'Sending link... 🌸' : 'Send sign-in link'}
                    </button>
                </form>

                {message && <p className='success-msg login-message'>{message}</p>}
                {(error || errorParam) && (
                    <div className='error-box'>
                        <p>{error || errorText[errorParam] || 'Something went wrong.'}</p>
                    </div>
                )}

                <div className='or-divider'><span>or</span></div>

                <button className='google-btn' onClick={handleGoogleLogin}>
                    <img
                        src='https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg'
                        alt='Google'
                        width='20'
                    />
                    Continue with Google
                </button>

                <p className='login-footer'>
                    💗 This space is for Code Blossom mentors and coordinators.
                    <br />
                    You'll receive a magic sign-in link by email.
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
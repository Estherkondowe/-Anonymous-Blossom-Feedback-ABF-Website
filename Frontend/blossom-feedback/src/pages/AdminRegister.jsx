import API_URL from '../config';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminRegister.css';

function AdminRegister(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }
        else if(password.length<6){
            setError('Thats not a secure password please enter a password with length of 6')
            return;
        }
        const allowedTestEmails = ['kondoweesther2@gmail.com'];

        if (!email.endsWith('@code-blossom.com') && !allowedTestEmails.includes(email)) {
            setError('Only Code Blossom emails allowed');
            return;
        }
        try {
            const response = await fetch(`${API_URL}/api/admin/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Registration successful! Please check your email to confirm your account🌸');
                setError('');
                setEmail('');
                setPassword('');
            } else {
                setError(data.error || 'Registration failed');
            }

        } catch (err) {
            setError('Could not connect to server. Please try again.');
        }
    };

    return(
        <div className='register-container'>
        <div className='register-card'>
         <div className='register-header'>  
            <h1>🌸 Admin Register</h1>
            <p>Create your admin account</p>
        </div> 
            <form onSubmit={handleRegister}>
                <div className='form-group'>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter the valid code blossom email"
                    />
                </div>

                <div className='form-group'>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                    />
                </div>

                {error && <p className='error-msg'>{error}</p>}
                {success && <p className='success-msg'>{success}</p>}

                <button type="submit" className='register-btn'>Register🌸</button>
            </form>

            <p className='login-link'>Already have an account? 
                <span 
                    onClick={() => navigate('/login')} 
                    style={{color: 'blue', cursor: 'pointer'}}>
                     Login here
                </span>
            </p>
        </div>
        </div>
    );
}

export default AdminRegister;
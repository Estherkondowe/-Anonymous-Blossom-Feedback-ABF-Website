import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';


function AdminLogin(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }
        if (!email.endsWith('@code-blossom.com')) {
        setError('Only Code Blossom emails allowed');
        return;
    }

        try {
            const response = await fetch('http://localhost:3000/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                navigate('/dashboard');
            } else {
                setError(data.error || 'Login failed');
            }

        } catch (err) {
            setError('connection to server failed. Please try again.');
        }
    };

    return(
        <div className='login-container'>
         <div className='login-card'>   
        <div className='login-header'>
            <h1>🌸 Welcome to the Login page Admin!</h1>
            <p>Login to view and manage feedback</p>
         </div>
            <form onSubmit={handleLogin}>
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

                <button type="submit" className='login-btn'>Login🌸</button>
            </form>
            <p className='register-link'>Don't have an account?
            <span onClick={() => navigate('/register')}> Register here</span>
            </p>
        </div>
        </div>
    );
}

export default AdminLogin;
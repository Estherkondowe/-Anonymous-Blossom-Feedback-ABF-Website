import API_URL from '../config';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './AdminLogin.css';


function AdminLogin(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess]= useState('');

    const navigate = useNavigate();
    const location = useLocation();

    // CHECKING IF THE ADMIN HAS VERIFIED THERI EMAIL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('verified') === 'true') {
            setSuccess('Email verified successfully! You can now login 🌸');
        }
    }, [location]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        console.log('login attempted with:', email);

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }
         
       /* const testEmails = ['kondoweesther2@gmail.com'];

        if (!email.endsWith('@code-blossom.com') && !testEmails.includes(email)) {
            setError('Only Code Blossom emails allowed');
            return;
        }*/
        try {
            const response = await fetch(`${API_URL}/api/admin/login`, {
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
                {success && <p className='success-msg'>{success}</p>}
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

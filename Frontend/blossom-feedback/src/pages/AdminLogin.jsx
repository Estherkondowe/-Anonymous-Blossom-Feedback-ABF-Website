import { useState, useEffect} from 'react';
import './AdminLogin.css';

function AdminLogin() {
    const [loading, setLoading]= useState(false);
    const [error, setError] = useState('');

    // Reading errors from URL when page loads
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const errorParam = params.get('error');

        if (errorParam === 'unauthorized') {
            setError('Wrong account! Please switch to your @code-blossom.com email.');
        } else if (errorParam === 'server') {
            setError('Something went wrong. Please try again.');
        }
    }, []);

    const  handleGoogleLogin =()=>{
        setLoading(true);
        window.location.href = 'https://anonymous-blossom-feedback-abf-website-1.onrender.com/api/auth/google';
    }
return (
    <div className='login-container'>
        <div className='login-card'>
            <div className='login-header'>
                <h1>🌸 Admin Login</h1>
                <p>Use your @code-blossom.com Google account</p>
            </div>

            {loading ? (
                <div className='loading-container'>
                    <div className='loading-spinner'></div>
                    <p className='loading-text'>
                        Connecting... please wait 🌸
                    </p>
                </div>
            ) : (
                <button
                    className='google-btn'
                    onClick={handleGoogleLogin}>
                    <img
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        alt="Google"
                        width="20"
                    />
                    Sign in with Google
                </button>
            )}

            
            {error && (
                <div className='error-box'>
                    <p> {error}</p>
                </div>
            )}

            <p className='login-footer'>
                💗 This space is for mentors only!
            </p>
        </div>
    </div>
);

};
export default AdminLogin;
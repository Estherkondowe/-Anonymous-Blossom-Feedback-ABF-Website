import { useState } from 'react';
import './AdminLogin.css';

function AdminLogin() {
    const [loading, setLoading]= useState(false);

    const  handleGoogleLogin =()=>{
        setLoading(true);
        window.location.href = 'https://anonymous-blossom-feedback-abf-website-1.onrender.com/api/auth/google';
    }
    return (
        <div className='login-container'>
            <div className='login-card'>
                <div className='login-header'>
                    <h1>🌸 Admin Login</h1>
                    <p>Sign in with your Code Blossom Google account</p>
                </div>

                {loading ? (
                    <div className='loading-container'>
                        <div className='loading-spinner'></div>
                        <p className='loading-text'>
                            Connecting to server... please wait 🌸
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

                <p className='login-footer'>
                    For admins only. Participants don't need to login 🌸
                </p>
            </div>
        </div>
    );

}
export default AdminLogin;
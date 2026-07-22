import './AdminLogin.css';

function AdminLogin() {
    return (
        <div className='login-container'>
            <div className='login-card'>
            <div className='login-header'>
                <h1>🌸 Admin Login</h1>
                <p>Sign in with your Code Blossom Google account</p>
            </div>
            <a href='https://anonymous-blossom-feedback-abf-website.onrender.com/api/auth/google' className='google-btn'>
                <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="20"
                />
                Sign in with Google
            </a>
                <p className='login-footer'>
                    For admins only. Participants don't need to login 🌸
                </p>
            </div>
        </div>
    );
}

export default AdminLogin;
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import blossomBg from '../images/background.jpg';

function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="landing-container">

            {/* Navbar */}
            <nav className="navbar">
                <h2 className="logo">🌸 ABF</h2>
                <button className="nav-btn" onClick={() => navigate('/feedback')}>
                    Submit Feedback
                </button>
            </nav>

            {/* Hero Section */}
            <section className="hero" style={{ backgroundImage: `url(${blossomBg})` }}>
                <div className="hero-overlay">
                    <h1 className="hero-title">Your Voice Matters.</h1>
                    <h1 className="hero-title">Speak Freely. 🌸</h1>
                    <p className="hero-subtitle">
                        A safe space for Code Blossom participants to share 
                        honest feedback — no account needed, completely anonymous.
                    </p>
                    <p className="hero-inspired">
                        Inspired by Marion's call for honest feedback at every All Hands Call 🌸
                    </p>
                    <div className="hero-buttons">
                        <button className="btn-primary" onClick={() => navigate('/feedback')}>
                            Submit Feedback
                        </button>
                    </div>
                </div>
            </section>

            {/* Value Section */}
            <section className="values-section">
                <h2>Why Anonymous Blossom Feedback?</h2>
                <div className="values-grid">
                    <div className="value-card">
                        <span>🔒</span>
                        <h3>100% Anonymous</h3>
                        <p>No account needed. No name required. Just your honest thoughts.</p>
                    </div>
                    <div className="value-card">
                        <span>💬</span>
                        <h3>Speak Honestly</h3>
                        <p>Share what you really think without fear of being judged.</p>
                    </div>
                    <div className="value-card">
                        <span>📈</span>
                        <h3>Drive Improvement</h3>
                        <p>Your feedback helps mentors make sessions even better.</p>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-section">
                <h2>How It Works</h2>
                <div className="steps-grid">
                    <div className="step-card">
                        <span className="step-number">1</span>
                        <h3>Fill the Form</h3>
                        <p>Share your session, mentor and honest thoughts.</p>
                    </div>
                    <div className="step-card">
                        <span className="step-number">2</span>
                        <h3>Submit Anonymously</h3>
                        <p>No login. No account. Just click submit and you're done.</p>
                    </div>
                    <div className="step-card">
                        <span className="step-number">3</span>
                        <h3>Mentors Improve</h3>
                        <p>Admins review feedback and make Code Blossom better for everyone.</p>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="cta-section">
                <h2>Ready to Share Your Thoughts?</h2>
                <p>It takes less than 2 minutes and makes a real difference 🌸</p>
                <button className="btn-primary" onClick={() => navigate('/feedback')}>
                    Submit Feedback Now
                </button>
            </section>

            {/* Footer */}
            <footer className="footer">
                <p>© 2025 Anonymous Blossom Feedback | Built for Code Blossom 🌸</p>
                <div className="footer-links">
                    <span onClick={() => navigate('/feedback')}>Submit Feedback</span>
                    <span onClick={() => navigate('/login')}>Admin Login</span>
                    <span onClick={() => navigate('/register')}>Admin Register</span>
                </div>
            </footer>

        </div>
    );
}

export default LandingPage;
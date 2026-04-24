import React from "react";
import { useNavigate } from "react-router-dom";
import './Footer.css';

const Footer= ()=>{
      const navigate = useNavigate();
 return(
    <footer className="footer">
                <p>© 2025 Anonymous Blossom Feedback | Built for Code Blossom 🌸</p>
                <div className="footer-links">
                    <span onClick={() => navigate('/feedback')}>Submit Feedback</span>
                    <span onClick={() => navigate('/login')}>Admin Login</span>
                    <span onClick={() => navigate('/register')}>Admin Register</span>
                </div>
            </footer>
 );
};

export default Footer;
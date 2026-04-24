import React from "react";
import { useNavigate } from "react-router-dom";
import './Navbar.css';

const Navbar= ()=>{
      const navigate= useNavigate();
    return (
        <nav className="navbar">
                <h2 className="logo">🌸 ABF</h2>
                <button className="nav-btn" onClick={() => navigate('/feedback')}>
                    Submit Feedback
                </button>
            </nav>

    );
}
export default Navbar;
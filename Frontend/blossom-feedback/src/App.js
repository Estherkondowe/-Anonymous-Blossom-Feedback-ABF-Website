import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {useEffect} from 'react';
import LandingPage from './pages/LandingPage.jsx';
import FeedbackForm from './pages/FeedbackForm.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';


function  App(){
  // Keep Render awake
  useEffect(() => {
    fetch('https://anonymous-blossom-feedback-abf-website-1.onrender.com/ping')
      .catch(() => {}); 
  }, []);
  return (
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/feedback" element={<FeedbackForm />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      
      </Routes>
    </BrowserRouter>
  );
}

export default App;
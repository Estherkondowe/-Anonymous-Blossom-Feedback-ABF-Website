import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import LandingPage from './pages/LandingPage.jsx';
import FeedbackForm from './pages/FeedbackForm.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminRegister from './pages/AdminRegister.jsx'; 
import ProtectedRoute from './components/ProtectedRoute.jsx';


function  App(){
  return (
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/feedback" element={<FeedbackForm />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/register" element={<AdminRegister/>}/>
      </Routes>
      <SpeedInsights />
    </BrowserRouter>
  );
}

export default App;
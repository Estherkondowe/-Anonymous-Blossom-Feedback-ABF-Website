import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import PublicPortal from './pages/PublicPortal.jsx';
import FormFill from './pages/FormFill.jsx';
import LoginPage from './pages/LoginPage.jsx';
import MagicVerify from './pages/MagicVerify.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Builder from './pages/Builder.jsx';
import Responses from './pages/Responses.jsx';

function App() {
    // Keep Render awake
    useEffect(() => {
        fetch('https://anonymous-blossom-feedback-abf-website-1.onrender.com/ping')
            .catch(() => {});
    }, []);

    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<PublicPortal />} />
                    <Route path="/f/:slug" element={<FormFill />} />
                    <Route path="/feedback" element={<Navigate to="/f/universal-feedback" replace />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/magic" element={<MagicVerify />} />
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/builder" element={<ProtectedRoute><Builder /></ProtectedRoute>} />
                    <Route path="/builder/:id" element={<ProtectedRoute><Builder /></ProtectedRoute>} />
                    <Route path="/responses/:formId" element={<ProtectedRoute><Responses /></ProtectedRoute>} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
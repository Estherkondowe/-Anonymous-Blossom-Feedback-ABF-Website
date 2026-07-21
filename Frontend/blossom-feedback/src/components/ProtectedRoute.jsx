import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');

    if (!token && !urlToken) {
        return <Navigate to="/login" />;
    }

    return children;
}

export default ProtectedRoute;
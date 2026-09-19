import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';
import FormBuilder from '../components/FormBuilder';
import FormsManager from '../components/FormsManager';
import './AdminDashboard.css';

function AdminDashboard(){
    const [activeTab, setActiveTab] = useState('feedback');
    const [token, setToken] = useState(null);
    const [feedbackList, setFeedbackList] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const urlToken = params.get('token');
        const authToken = urlToken || localStorage.getItem('token');

        if (urlToken) {
            localStorage.setItem('token', urlToken);
            window.history.replaceState({}, document.title, '/dashboard');
        }

        setToken(authToken);

        const fetchFeedback = async () => {
            try {
                const response = await fetch(`${API_URL}/api/feedback`, {
                    headers: { 'Authorization': `Bearer ${authToken}` }
                });
                const data = await response.json();
                if (response.ok) {
                    setFeedbackList(data);
                    setError('');
                } else {
                    setError('Failed to load feedback. Your session may have expired.');
                }
            } catch (err) {
                setError('Could not connect to server');
            } finally {
                setLoading(false);
            }
        };

        if (authToken) {
            fetchFeedback();
        } else {
            setLoading(false);
        }
    }, []);

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${API_URL}/api/feedback/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setFeedbackList(feedbackList.filter(item => item._id !== id));
            } else {
                setError('Failed to delete feedback');
            }
        } catch (err) {
            setError('Could not connect to server');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        navigate('/login');
    };

    return(
        <div className='dashboard-container'>
            <div className='dashboard-navbar'>
                <h1>🌸 Admin Dashboard</h1>
                <button onClick={logout} className='logout-btn'>Logout</button>
            </div>

            <div className='dashboard-tabs'>
                <button
                    className={activeTab === 'feedback' ? 'tab-btn active' : 'tab-btn'}
                    onClick={() => setActiveTab('feedback')}
                >
                    Feedback
                </button>
                <button
                    className={activeTab === 'forms' ? 'tab-btn active' : 'tab-btn'}
                    onClick={() => setActiveTab('forms')}
                >
                    Google Forms
                </button>
            </div>

            {activeTab === 'feedback' && (
                <>
                    <p className='stats-bar'>Total Feedback: {feedbackList.length}</p>
                    {error && <p className='error-msg'>{error}</p>}

                    {loading ? (
                        <p className='no-feedback'>Loading feedback... 🌸</p>
                    ) : feedbackList.length === 0 ? (
                        <p className='no-feedback'>🌸 No feedback submitted yet</p>
                    ) : (
                        <div className='feedback-grid'>
                            {feedbackList.map((item) => (
                                <div key={item._id} className='feedback-card'>
                                    <p><strong>Session:</strong> {item.session}</p>
                                    <p><strong>Mentor:</strong> {item.mentor}</p>
                                    <p><strong>Message:</strong> {item.message}</p>
                                    <p className='rating'><strong>Rating:</strong> {item.rating}/5 ⭐</p>
                                    <p className='feedback-date'>📅 {new Date(item.createdAt).toLocaleDateString()}</p>
                                    <button onClick={() => handleDelete(item._id)} className='delete-btn'>Delete</button>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {activeTab === 'forms' && (
                showCreateForm ? (
                    <FormBuilder
                        apiUrl={API_URL}
                        token={token}
                        onCreated={() => setShowCreateForm(false)}
                        onCancel={() => setShowCreateForm(false)}
                    />
                ) : (
                    <FormsManager
                        apiUrl={API_URL}
                        token={token}
                        onCreateClick={() => setShowCreateForm(true)}
                    />
                )
            )}
        </div>
    );
}

export default AdminDashboard;
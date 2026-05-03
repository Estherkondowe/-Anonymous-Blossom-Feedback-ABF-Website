import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import './AdminDashboard.css'

function AdminDashboard(){
    const [feedbackList, setFeedbackList]= useState([]);
    const [error, setError]= useState('');
    const navigate= useNavigate();
    const token =localStorage.getItem('token');

    useEffect(()=>{
        const fetchFeedback=async()=>{
    try{
        const response= await fetch('https://anonymous-blossom-feedback-abf-website.onrender.com/api/feedback', {
            headers:{'Authorization': `Bearer ${token}`}
        });
        const data =await response.json();
        if(response.ok){
            setFeedbackList(data);
        }else{
            setError('Failed to load feedback')
        }
    }catch(err){
        setError('could not connect to server');
    }
 };
        fetchFeedback();
    }, [token]);
 
 const handleDelete = async (id) => {
        try {
    const response = await fetch(`https://anonymous-blossom-feedback-abf-website.onrender.com/api/feedback/${id}`, {
    method: 'DELETE',
    headers: {'Authorization': `Bearer ${token}`}
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

 const logout=()=>{
    localStorage.removeItem('token');
    navigate('/login');
 } 
return(
    <div className='dashboard-container'>
        <div className='dashboard-navbar'>
            <h1>🌸 Admin Dashboard</h1>
            <button onClick={logout} className='logout-btn'>Logout</button>
        </div>

        <p className='stats-bar'>Total Feedback: {feedbackList.length}</p>
        {error && <p className='error-msg'>{error}</p>}

        {feedbackList.length === 0 ? (
            <p className='no-feedback'>No feedback submitted yet</p>
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
    </div>
)};
export default AdminDashboard;

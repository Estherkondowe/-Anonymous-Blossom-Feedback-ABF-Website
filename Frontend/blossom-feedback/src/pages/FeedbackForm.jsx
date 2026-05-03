import { useState } from "react";
//import { useNavigate } from "react-router-dom";
import './FeedbackForm.css';



function FeedbackForm(){
    const [session, setSession]= useState('');
    const [mentor, setMentor]= useState('');
    const [message, setMessage]= useState('');
    const [rating, setRating]=useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    //const navigate=useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!session || !mentor || !message || !rating) {
            setError('Please fill in all fields');
            return;
        }

        try {
            const response = await fetch('https://anonymous-blossom-feedback-abf-website.onrender.com/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ session, mentor, message, rating })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Thank you! Your feedback has been submitted 🌸');
                setError('');
                setSession('');
                setMentor('');
                setMessage('');
                setRating('');
            } else {
                setError(data.error || 'Something went wrong');
            }

        } catch (err) {
            setError('sory  server connection failed . Please try again.');
        }
    };
    return(
        <div className="feedback-container">
            <div className="feedback-card">
            <div className="feedback-header">
            <h1>🌸Anonymous Blossom Feedback</h1>
            <p>This is a safe space. Your feedback is completely anonymous and helps Code Blossom grow.</p>
            <p>Feel free to share your honest thoughts with us!</p>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>What are you giving Feedback on?</label>
                    <input 
                        type="text"
                        value={session}
                        onChange={(e) => setSession(e.target.value)}
                        placeholder="e.g. Curriculum, Mentor Hours sessions, All Hands Call etc..  "
                    />
                </div>

                <div className="form-group">
                    <label>Who is this feedback for?</label>
                    <input 
                        type="text"
                        value={mentor}
                        onChange={(e) => setMentor(e.target.value)}
                        placeholder="e.g. Code Blossom Team or General"
                    />
                </div>

                <div className="form-group">
                    <label>Share your honest thoughts freely</label>
                    <textarea 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="You are safe here. say what you really think.."
                    />
                </div>

                <div form-group>
                    <label>How would you rate your experience with Code Blossom? (1-5)</label>
                    <input 
                        type="number"
                        min="1"
                        max="5"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        placeholder="1-5"
                    />
                </div>
                {error && <p className="error-msg">{error}</p>}
                {success && <p className="success-msg">{success}</p>}

                <button type="submit">Submit Feedback 🌸</button>
            </form>

        </div>
        </div>
    );
}
export default FeedbackForm;

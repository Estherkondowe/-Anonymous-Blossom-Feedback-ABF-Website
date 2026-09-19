import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './PublicPortal.css';

function PublicPortal() {
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            try {
                const data = await api.get('/api/native/portal');
                setForms(data);
            } catch (err) {
                setError('Could not load forms right now. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <div className="portal-container">
            <Navbar />

            <header className="portal-hero">
                <h1>🌸 Code Blossom Feedback Center</h1>
                <p>
                    Every form on this page is anonymous — no account, no name, no judgment.
                    Pick a form below to share your honest thoughts.
                </p>
            </header>

            {error && <p className="error-msg portal-error">{error}</p>}

            {loading ? (
                <p className="no-feedback">Loading open forms... 🌸</p>
            ) : (
                <div className="portal-grid">
                    {forms.length === 0 ? (
                        <p className="no-feedback">🌸 No forms are open right now. Check back soon!</p>
                    ) : (
                        forms.map((form) => (
                            <button
                                key={form.slug}
                                className="portal-card"
                                onClick={() => navigate(`/f/${form.slug}`)}
                            >
                                <div className="portal-card-top">
                                    {form.isPinned && <span className="pinned-badge">Always open</span>}
                                    {form.category && <span className="category-tag">{form.category}</span>}
                                </div>
                                <h2>{form.title}</h2>
                                {form.description && <p className="portal-card-desc">{form.description}</p>}
                                <p className="portal-card-count">
                                    {form.responseCount} {form.responseCount === 1 ? 'response' : 'responses'} so far
                                </p>
                                <span className="portal-card-cta">Give feedback →</span>
                            </button>
                        ))
                    )}
                </div>
            )}

            <Footer />
        </div>
    );
}

export default PublicPortal;
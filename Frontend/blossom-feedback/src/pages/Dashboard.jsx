import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [copiedSlug, setCopiedSlug] = useState('');

    const loadForms = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await api.get('/api/native/forms');
            setForms(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadForms();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const copyShareLink = async (slug) => {
        const url = `${window.location.origin}/f/${slug}`;
        try {
            await navigator.clipboard.writeText(url);
        } catch {
            const textarea = document.createElement('textarea');
            textarea.value = url;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }
        setCopiedSlug(slug);
        setTimeout(() => setCopiedSlug(''), 2000);
    };

    const toggleActive = async (form) => {
        try {
            const data = await api.patch(`/api/native/forms/${form.id}`, {
                settings: { active: !form.active }
            });
            setForms(forms.map((f) => (f.id === form.id ? { ...f, active: data.form.active } : f)));
        } catch (err) {
            setError(err.message);
        }
    };

    const duplicateForm = async (form) => {
        try {
            await api.post(`/api/native/forms/${form.id}/duplicate`);
            loadForms();
        } catch (err) {
            setError(err.message);
        }
    };

    const deleteForm = async (form) => {
        if (!window.confirm(`Delete "${form.title}"? This hides it and closes it.`)) return;
        try {
            await api.del(`/api/native/forms/${form.id}`);
            loadForms();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="dash-container">
            <div className="dash-navbar">
                <h1>🌸 Mentor Dashboard</h1>
                <div className="dash-user">
                    <span className="dash-email">{user?.email}</span>
                    <button onClick={logout} className="logout-btn">Logout</button>
                </div>
            </div>

            {error && <p className="error-msg dash-error">{error}</p>}

            <div className="dash-toolbar">
                <p className="dash-summary">
                    You have {forms.length} {forms.length === 1 ? 'form' : 'forms'}.
                </p>
                <button className="create-form-btn" onClick={() => navigate('/builder')}>
                    + New Form
                </button>
            </div>

            {loading ? (
                <p className="no-feedback">Loading your forms... 🌸</p>
            ) : forms.length === 0 ? (
                <div className="empty-state">
                    <p>🌸 You haven't created any forms yet</p>
                    <button className="create-form-btn" onClick={() => navigate('/builder')}>
                        Create your first feedback form
                    </button>
                </div>
            ) : (
                <div className="dash-grid">
                    {forms.map((form) => (
                        <div key={form.id} className="dash-card">
                            <div className="dash-card-top">
                                <h3>{form.title}</h3>
                                {form.active ? (
                                    <span className="status-badge open">Open</span>
                                ) : (
                                    <span className="status-badge closed">Closed</span>
                                )}
                            </div>
                            {form.description && <p className="dash-card-desc">{form.description}</p>}
                            {form.category && <p className="dash-card-desc">Category: {form.category}</p>}
                            <div className="dash-card-meta">
                                <span>{form.responseCount} responses</span>
                                <span>{form.questionCount} questions</span>
                                <span>{new Date(form.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="dash-card-actions">
                                <button className="dash-btn primary" onClick={() => navigate(`/responses/${form.id}`)}>
                                    Responses
                                </button>
                                <button className="dash-btn" onClick={() => navigate(`/builder/${form.id}`)}>
                                    Edit
                                </button>
                                <button className="dash-btn" onClick={() => toggleActive(form)}>
                                    {form.active ? 'Close' : 'Reopen'}
                                </button>
                                <button className="dash-btn" onClick={() => copyShareLink(form.slug)}>
                                    {copiedSlug === form.slug ? 'Copied!' : 'Share'}
                                </button>
                                <button className="dash-btn ghost" onClick={() => duplicateForm(form)}>
                                    Duplicate
                                </button>
                                <button className="dash-btn danger" onClick={() => deleteForm(form)}>
                                    Delete
                                </button>
                            </div>
                            <p className="dash-share">Share link: /f/{form.slug}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Dashboard;
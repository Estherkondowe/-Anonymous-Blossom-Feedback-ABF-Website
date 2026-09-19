import { useEffect, useState } from 'react';

function FormsManager({ apiUrl, token, onCreateClick }) {
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedForm, setSelectedForm] = useState(null);
    const [responsesData, setResponsesData] = useState(null);
    const [responsesLoading, setResponsesLoading] = useState(false);
    const [responsesError, setResponsesError] = useState('');

    const loadForms = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`${apiUrl}/api/forms`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setForms(data);
            } else {
                setError(data.error || 'Failed to load forms');
            }
        } catch (err) {
            setError('Could not connect to server');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadForms();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleViewResponses = async (form) => {
        setSelectedForm(form);
        setResponsesLoading(true);
        setResponsesError('');
        setResponsesData(null);
        try {
            const response = await fetch(`${apiUrl}/api/forms/${form._id}/responses`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setResponsesData(data);
            } else {
                setResponsesError(data.error || 'Failed to load responses');
            }
        } catch (err) {
            setResponsesError('Could not connect to server');
        } finally {
            setResponsesLoading(false);
        }
    };

    const handleDelete = async (form) => {
        if (!window.confirm(`Delete the form "${form.title}" and remove it?`)) return;
        try {
            const response = await fetch(`${apiUrl}/api/forms/${form._id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setForms(forms.filter(f => f._id !== form._id));
                if (selectedForm && selectedForm._id === form._id) {
                    setSelectedForm(null);
                    setResponsesData(null);
                }
            } else {
                setError('Failed to delete form');
            }
        } catch (err) {
            setError('Could not connect to server');
        }
    };

    const titleForQuestion = (items, questionId) => {
        for (const item of items) {
            const questionName = item?.questionItem?.question?.questionId;
            if (questionName === questionId) return item.title;
        }
        return null;
    };

    const renderResponses = () => {
        if (responsesLoading) {
            return <p className="no-feedback">Loading responses... 🌸</p>;
        }
        if (responsesError) {
            return <p className="error-msg">{responsesError}</p>;
        }
        if (!responsesData) return null;

        const { items, responses } = responsesData;

        if (responses.length === 0) {
            return <p className="no-feedback">🌸 No responses yet for this form</p>;
        }

        return (
            <div className="responses-list">
                {responses.map((response, rIndex) => (
                    <div key={response.responseId || rIndex} className="response-card">
                        <p className="response-date">
                            📅 {new Date(response.createTime).toLocaleString()}
                        </p>
                        {Object.entries(response.answers || {}).map(([questionId, answer]) => {
                            const title = titleForQuestion(items, questionId) || `Question ${questionId.slice(0, 6)}`;
                            const values = answer?.textAnswers?.answers?.map(a => a.value) || [];
                            return (
                                <div key={questionId} className="response-item">
                                    <strong>{title}</strong>
                                    <span>{values.join(', ') || '—'}</span>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="forms-manager">
            <div className="forms-toolbar">
                <p className="stats-bar forms-stats">Total Forms: {forms.length}</p>
                <button className="create-form-btn" onClick={onCreateClick}>
                    + Create Form
                </button>
            </div>

            {error && <p className="error-msg">{error}</p>}

            {loading ? (
                <p className="no-feedback">Loading forms... 🌸</p>
            ) : forms.length === 0 ? (
                <div className="empty-state">
                    <p>🌸 No forms created yet</p>
                    <button className="create-form-btn" onClick={onCreateClick}>
                        + Create your first form
                    </button>
                </div>
            ) : (
                <div className="forms-grid">
                    {forms.map((form) => (
                        <div key={form._id} className="form-card">
                            <h3>{form.title}</h3>
                            {form.description && <p className="form-description">{form.description}</p>}
                            <p className="form-date">📅 Created {new Date(form.createdAt).toLocaleDateString()}</p>
                            <a
                                className="form-link"
                                href={form.googleFormUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Open Form ↗
                            </a>
                            <div className="form-card-actions">
                                <button
                                    className="view-btn"
                                    onClick={() => handleViewResponses(form)}
                                >
                                    View Responses
                                </button>
                                <button className="delete-btn" onClick={() => handleDelete(form)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedForm && (
                <div className="responses-panel">
                    <div className="responses-panel-header">
                        <h3>Responses — {selectedForm.title}</h3>
                        <button className="cancel-btn" onClick={() => { setSelectedForm(null); setResponsesData(null); }}>
                            Close
                        </button>
                    </div>
                    {renderResponses()}
                </div>
            )}
        </div>
    );
}

export default FormsManager;
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import API_URL from '../config';
import './Dashboard.css';
import './Responses.css';

function Responses() {
    const { formId } = useParams();
    const [meta, setMeta] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [responses, setResponses] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const load = async (targetPage) => {
        setLoading(true);
        setError('');
        try {
            const data = await api.get(`/api/native/forms/${formId}?leaf=0`);
            setMeta({ title: data.title, slug: data.slug });
            setQuestions(data.questions || []);

            const resp = await api.get(`/api/native/forms/${formId}/responses?page=${targetPage}&limit=20`);
            setResponses(resp.responses);
            setTotal(resp.total);
            setPage(resp.page);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formId]);

    const maxPage = Math.max(1, Math.ceil(total / 20));

    return (
        <div className="dash-container">
            <div className="dash-navbar">
                <h1>🌸 Responses</h1>
                <Link to="/dashboard" className="back-dash">← Dashboard</Link>
            </div>

            <div className="responses-toolbar">
                <div>
                    <h2>{meta?.title || 'Form'}</h2>
                    <p className="responses-stat">{total} {total === 1 ? 'response' : 'responses'}</p>
                </div>
                {meta && (
                    <a
                        className="csv-btn"
                        href={`${API_URL}/api/native/forms/${formId}/responses/export`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        ⬇ Export CSV
                    </a>
                )}
            </div>

            {error && <p className="error-msg dash-error">{error}</p>}
            {loading ? (
                <p className="no-feedback">Loading responses... 🌸</p>
            ) : responses.length === 0 ? (
                <p className="no-feedback">🌸 No responses yet. Share your form link to start collecting!</p>
            ) : (
                <>
                    <div className="responses-list">
                        {responses.map((r) => (
                            <div key={r.id} className="response-card">
                                <p className="response-date">
                                    📅 {new Date(r.submittedAt).toLocaleString()}
                                </p>
                                {questions.map((q) => {
                                    const answer = r.answers.find((a) => a.questionId === q.id);
                                    const value = answer?.value;
                                    const display = Array.isArray(value)
                                        ? value.join(', ')
                                        : (value === undefined || value === null || value === '' ? '—' : String(value));
                                    return (
                                        <div key={q.id} className="response-item">
                                            <strong>{q.title}</strong>
                                            <span>{display}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>

                    {total > 20 && (
                        <div className="pagination">
                            <button className="dash-btn" disabled={page <= 1} onClick={() => load(page - 1)}>
                                ← Prev
                            </button>
                            <span className="page-info">Page {page} of {maxPage}</span>
                            <button className="dash-btn" disabled={page >= maxPage} onClick={() => load(page + 1)}>
                                Next →
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Responses;
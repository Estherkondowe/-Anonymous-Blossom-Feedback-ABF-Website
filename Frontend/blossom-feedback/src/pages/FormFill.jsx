import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './FormFill.css';

const INITIAL = {};

function QuestionField({ question, value, onChange }) {
    const common = {
        required: question.required,
        value,
        onChange: (e) => {
            const next = e.target.value;
            onChange(next);
        }
    };

    if (question.type === 'paragraph') {
        return <textarea rows="5" {...common} placeholder={question.placeholder} />;
    }

    if (question.type === 'text') {
        return <input type="text" {...common} placeholder={question.placeholder} />;
    }

    if (question.type === 'rating') {
        const low = question.scale?.low || 1;
        const high = question.scale?.high || 5;
        const labels = [];
        for (let i = low; i <= high; i += 1) labels.push(i);
        return (
            <div className="rating-row">
                <div className="rating-options" role="radiogroup">
                    {labels.map((n) => (
                        <button
                            key={n}
                            type="button"
                            className={value === String(n) ? 'rating-option active' : 'rating-option'}
                            onClick={() => onChange(String(n))}
                            aria-pressed={value === String(n)}
                        >
                            {n}
                        </button>
                    ))}
                </div>
                <span className="rating-hint">
                    {value ? `${value} ${value === '1' ? 'star' : 'stars'}` : `Rate from ${low} to ${high}`}
                </span>
            </div>
        );
    }

    if (question.type === 'multiple-choice') {
        return (
            <div className="choice-group">
                {(question.options || []).map((option) => (
                    <label key={option} className="choice-option">
                        <input
                            type="radio"
                            name={question.id}
                            checked={value === option}
                            onChange={() => onChange(option)}
                        />
                        <span>{option}</span>
                    </label>
                ))}
            </div>
        );
    }

    if (question.type === 'checkbox') {
        const selected = Array.isArray(value) ? value : [];
        return (
            <div className="choice-group">
                {(question.options || []).map((option) => (
                    <label key={option} className="choice-option">
                        <input
                            type="checkbox"
                            checked={selected.includes(option)}
                            onChange={(e) => {
                                const next = e.target.checked
                                    ? [...selected, option]
                                    : selected.filter((o) => o !== option);
                                onChange(next);
                            }}
                        />
                        <span>{option}</span>
                    </label>
                ))}
            </div>
        );
    }

    return <input type="text" {...common} />;
}

function FormFill() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState(null);
    const [answers, setAnswers] = useState(INITIAL);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await api.get(`/api/native/forms/public/${slug}`);
                setForm(data);
                setAnswers({});
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [slug]);

    const updateAnswer = (questionId, value) => {
        setAnswers((prev) => ({ ...prev, [questionId]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form) return;

        const missing = form.questions
            .filter((q) => q.required)
            .filter((q) => {
                const v = answers[q.id];
                return v === undefined || v === '' || (Array.isArray(v) && v.length === 0);
            });

        if (missing.length > 0) {
            setError('Please fill in all required fields');
            window.scrollTo(0, 0);
            return;
        }

        setSubmitting(true);
        setError('');
        try {
            await api.post(`/api/native/forms/public/${slug}/respond`, {
                answers: form.questions
                    .filter((q) => answers[q.id] !== undefined && answers[q.id] !== '')
                    .map((q) => ({ questionId: q.id, value: answers[q.id] }))
            });
            setDone(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="fill-container">
                <Navbar />
                <p className="no-feedback">Loading form... 🌸</p>
                <Footer />
            </div>
        );
    }

    if (error && !form) {
        return (
            <div className="fill-container">
                <Navbar />
                <div className="fill-card error-card">
                    <p className="error-msg">{error}</p>
                    <button className="primary-fill-btn" onClick={() => navigate('/')}>
                        Back to all forms
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    if (done) {
        return (
            <div className="fill-container">
                <Navbar />
                <div className="fill-card done-card">
                    <h2>Thank you for your feedback 🌸</h2>
                    <p>Your voice helps make Code Blossom better. It's completely anonymous.</p>
                    <button className="primary-fill-btn" onClick={() => navigate('/')}>
                        Back to all forms
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="fill-container">
            <Navbar />
            <form className="fill-card" onSubmit={handleSubmit}>
                {error && <p className="error-msg fill-error">{error}</p>}
                <h1>{form.title}</h1>
                {form.description && <p className="fill-description">{form.description}</p>}

                {form.questions.map((question, index) => (
                    <div key={question.id} className="fill-question">
                        <label className="fill-label">
                            {index + 1}. {question.title}
                            {question.required && <span className="required-star"> *</span>}
                        </label>
                        {question.description && <p className="fill-q-desc">{question.description}</p>}
                        <QuestionField
                            question={question}
                            value={answers[question.id]}
                            onChange={(v) => updateAnswer(question.id, v)}
                        />
                    </div>
                ))}

                <button type="submit" className="primary-fill-btn" disabled={submitting}>
                    {submitting ? 'Submitting... 🌸' : 'Submit anonymously'}
                </button>
            </form>
            <Footer />
        </div>
    );
}

export default FormFill;
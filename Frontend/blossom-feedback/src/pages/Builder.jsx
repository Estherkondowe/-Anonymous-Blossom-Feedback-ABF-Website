import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';
import './Builder.css';

let idCounter = 0;
const newId = () => `q${++idCounter}-${Date.now()}`;

const newQuestion = () => ({
    id: newId(),
    type: 'text',
    title: '',
    description: '',
    required: false,
    options: ['Option 1'],
    scale: { low: 1, high: 5, lowLabel: 'Poor', highLabel: 'Excellent' }
});

const TYPE_LABELS = [
    { value: 'text', label: 'Short answer' },
    { value: 'paragraph', label: 'Paragraph' },
    { value: 'rating', label: 'Rating (1-5)' },
    { value: 'multiple-choice', label: 'Multiple choice' },
    { value: 'checkbox', label: 'Checkboxes' }
];

const toPayload = (title, description, category, active, questions) => ({
    title,
    description,
    category,
    settings: { active },
    questions: questions.map((q) => ({
        id: q.id,
        type: q.type,
        title: q.title,
        description: q.description,
        required: q.required,
        options: ['multiple-choice', 'checkbox'].includes(q.type)
            ? q.options.map((o) => o.trim()).filter(Boolean)
            : undefined,
        scale: q.type === 'rating' ? q.scale : undefined
    }))
});

function Builder() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [active, setActive] = useState(true);
    const [questions, setQuestions] = useState([newQuestion()]);
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isEdit) return;
        const load = async () => {
            try {
                const data = await api.get(`/api/native/forms/${id}`);
                setTitle(data.title);
                setDescription(data.description || '');
                setCategory(data.category || '');
                setActive(data.settings?.active !== false);
                setQuestions((data.questions && data.questions.length ? data.questions : [newQuestion()]));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, isEdit]);

    const updateQuestion = (qid, patch) => {
        setQuestions(questions.map((q) => (q.id === qid ? { ...q, ...patch } : q)));
    };

    const addQuestion = () => setQuestions([...questions, newQuestion()]);
    const removeQuestion = (qid) => setQuestions(questions.filter((q) => q.id !== qid));

    const updateOption = (qid, index, value) => {
        setQuestions(questions.map((q) => {
            if (q.id !== qid) return q;
            const options = [...q.options];
            options[index] = value;
            return { ...q, options };
        }));
    };

    const addOption = (qid, index) => {
        setQuestions(questions.map((q) => {
            if (q.id !== qid) return q;
            const options = [...q.options];
            options.splice(index + 1, 0, `Option ${index + 2}`);
            return { ...q, options };
        }));
    };

    const removeOption = (qid, index) => {
        setQuestions(questions.map((q) => {
            if (q.id !== qid) return q;
            return { ...q, options: q.options.filter((_, i) => i !== index) };
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setError('');

        if (!title.trim()) {
            setError('Please give your form a title');
            return;
        }

        const payload = toPayload(title.trim(), description.trim(), category.trim(), active, questions);

        const questionError = payload.questions.find((q) => !q.title.trim());
        if (questionError) {
            setError('Every question needs text');
            return;
        }
        const choicesError = payload.questions.find(
            (q) => ['multiple-choice', 'checkbox'].includes(q.type) && (!q.options || q.options.length === 0)
        );
        if (choicesError) {
            setError('Every multiple choice / checkbox question needs at least one option');
            return;
        }

        setSaving(true);
        try {
            if (isEdit) {
                await api.patch(`/api/native/forms/${id}`, payload);
            } else {
                await api.post('/api/native/forms', payload);
            }
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <p className="no-feedback">Loading builder... 🌸</p>;
    }

    return (
        <div className="builder-container">
            <div className="builder-header">
                <div>
                    <Link to="/dashboard" className="builder-back">← Back to dashboard</Link>
                    <h1>{isEdit ? 'Edit Form' : 'Create a Feedback Form'} 🌸</h1>
                </div>
            </div>

            <form className="builder-card" onSubmit={handleSave}>
                {error && <p className="error-msg">{error}</p>}

                <div className="form-group">
                    <label>Form title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. All Hands Call — October Feedback"
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        rows="2"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="What is this form about? (shown to respondents)"
                    />
                </div>

                <div className="builder-row">
                    <div className="form-group builder-col">
                        <label>Category</label>
                        <input
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="e.g. All Hands Call, Mentor Hours, Curriculum"
                        />
                    </div>
                    <div className="form-group builder-col">
                        <label>Status</label>
                        <select value={active ? 'true' : 'false'} onChange={(e) => setActive(e.target.value === 'true')}>
                            <option value="true">Open — accepting responses</option>
                            <option value="false">Closed — link hidden from portal</option>
                        </select>
                    </div>
                </div>

                <div className="builder-questions-head">
                    <h3>Questions</h3>
                    <span className="builder-hint">Respondents answer anonymously</span>
                </div>

                {questions.map((question) => (
                    <div key={question.id} className="builder-question">
                        <div className="builder-question-top">
                            <input
                                type="text"
                                value={question.title}
                                onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
                                placeholder="Question"
                            />
                            <button
                                type="button"
                                className="icon-btn"
                                onClick={() => removeQuestion(question.id)}
                                aria-label="Remove question"
                                title="Remove question"
                            >
                                ✕
                            </button>
                        </div>

                        <input
                            className="builder-q-desc"
                            type="text"
                            value={question.description}
                            onChange={(e) => updateQuestion(question.id, { description: e.target.value })}
                            placeholder="Optional helper text"
                        />

                        <div className="builder-question-rows">
                            <select
                                value={question.type}
                                onChange={(e) => updateQuestion(question.id, { type: e.target.value })}
                                aria-label="Question type"
                            >
                                {TYPE_LABELS.map((t) => (
                                    <option key={t.value} value={t.value}>{t.label}</option>
                                ))}
                            </select>

                            <label className="required-toggle">
                                <input
                                    type="checkbox"
                                    checked={question.required}
                                    onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
                                />
                                Required
                            </label>
                        </div>

                        {(question.type === 'multiple-choice' || question.type === 'checkbox') && (
                            <div className="options-editor">
                                {question.options.map((option, index) => (
                                    <div key={index} className="option-row">
                                        <input
                                            type="text"
                                            value={option}
                                            onChange={(e) => updateOption(question.id, index, e.target.value)}
                                            placeholder={`Option ${index + 1}`}
                                        />
                                        {question.options.length > 1 && (
                                            <button
                                                type="button"
                                                className="icon-btn"
                                                onClick={() => removeOption(question.id, index)}
                                                aria-label="Remove option"
                                                title="Remove option"
                                            >
                                                ✕
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            className="add-option-btn"
                                            onClick={() => addOption(question.id, index)}
                                            title="Add option after this one"
                                        >
                                            +
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                <button type="button" className="add-question-btn" onClick={addQuestion}>
                    + Add question
                </button>

                <div className="builder-actions">
                    <button type="submit" className="primary-btn" disabled={saving}>
                        {saving ? 'Saving... 🌸' : (isEdit ? 'Save changes' : 'Create form')}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Builder;
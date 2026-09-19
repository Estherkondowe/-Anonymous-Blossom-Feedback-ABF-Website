import { useState } from 'react';

let idCounter = 0;
const newId = () => `q-${++idCounter}-${Date.now()}`;

const newQuestion = () => ({
  id: newId(),
  text: '',
  type: 'text',
  required: false,
  long: false,
  options: ['Option 1']
});

function FormBuilder({ apiUrl, token, onCreated, onCancel }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState([newQuestion()]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const updateQuestion = (id, patch) => {
        setQuestions(questions.map(q => (q.id === id ? { ...q, ...patch } : q)));
    };

    const addQuestion = () => setQuestions([...questions, newQuestion()]);

    const removeQuestion = (id) => setQuestions(questions.filter(q => q.id !== id));

    const updateOption = (qid, index, value) => {
        setQuestions(questions.map(q => {
            if (q.id !== qid) return q;
            const options = [...q.options];
            options[index] = value;
            return { ...q, options };
        }));
    };

    const addOption = (qid) => {
        const question = questions.find(q => q.id === qid);
        if (!question) return;
        updateQuestion(qid, { options: [...question.options, `Option ${question.options.length + 1}`] });
    };

    const removeOption = (qid, index) => {
        const question = questions.find(q => q.id === qid);
        if (!question) return;
        updateQuestion(qid, { options: question.options.filter((_, i) => i !== index) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!title.trim()) {
            setError('Please give your form a title');
            return;
        }

        const cleaned = questions.map(q => {
            const isLongText = q.type === 'text-long';
            return {
                text: q.text.trim(),
                type: isLongText ? 'text' : q.type,
                required: q.required,
                long: isLongText ? true : (q.type === 'text' ? q.long : false),
                options: q.type === 'multiple-choice'
                    ? q.options.map(o => o.trim()).filter(Boolean)
                    : undefined
            };
        });

        if (cleaned.some(q => !q.text)) {
            setError('Every question needs text');
            return;
        }
        if (cleaned.some(q => q.type === 'multiple-choice' && (!q.options || q.options.length === 0))) {
            setError('Every multiple choice question needs at least one option');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${apiUrl}/api/forms/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: title.trim(),
                    description: description.trim(),
                    questions: cleaned
                })
            });
            const data = await response.json();

            if (response.ok) {
                onCreated(data.form);
            } else {
                setError(data.error || 'Failed to create form');
            }
        } catch (err) {
            setError('Could not connect to server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-builder">
            <div className="form-builder-header">
                <h2>🌸 Create a Google Form</h2>
                <button className="cancel-btn" onClick={onCancel}>Back to Forms</button>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Form Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. All Hands Call Feedback"
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Optional description shown to respondents"
                        rows="2"
                    />
                </div>

                <div className="questions-section">
                    <h3>Questions</h3>
                    {questions.map((question) => (
                        <div key={question.id} className="question-card">
                            <div className="question-top-row">
                                <input
                                    type="text"
                                    value={question.text}
                                    onChange={(e) => updateQuestion(question.id, { text: e.target.value })}
                                    placeholder="Question text"
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

                            <div className="question-options-row">
                                <select
                                    value={question.type}
                                    onChange={(e) => updateQuestion(question.id, { type: e.target.value })}
                                    aria-label="Question type"
                                >
                                    <option value="text">Short answer</option>
                                    <option value="text-long">Paragraph</option>
                                    <option value="rating">Rating (1-5)</option>
                                    <option value="multiple-choice">Multiple choice</option>
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

                            {question.type === 'multiple-choice' && (
                                <div className="options-editor">
                                    {question.options.map((option, index) => (
                                        <div key={index} className="option-row">
                                            <input
                                                type="text"
                                                value={option}
                                                onChange={(e) => updateOption(question.id, index, e.target.value)}
                                                placeholder={`Option ${index + 1}`}
                                            />
                                            <button
                                                type="button"
                                                className="icon-btn"
                                                onClick={() => removeOption(question.id, index)}
                                                aria-label="Remove option"
                                                title="Remove option"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                    <button type="button" className="add-option-btn" onClick={() => addOption(question.id)}>
                                        + Add option
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}

                    <button type="button" className="add-question-btn" onClick={addQuestion}>
                        + Add question
                    </button>
                </div>

                {error && <p className="error-msg">{error}</p>}

                <div className="form-builder-actions">
                    <button type="submit" className="primary-btn" disabled={loading}>
                        {loading ? 'Creating form... 🌸' : 'Create Form 🌸'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default FormBuilder;
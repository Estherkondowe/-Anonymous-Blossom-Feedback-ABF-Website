const Form = require('../models/form');
const Admin = require('../models/admin');
const axios = require('axios');
const { callWithGoogleToken, GoogleTokenError } = require('../services/googleToken');

const QUESTION_TYPES = ['text', 'rating', 'multiple-choice'];

function validateQuestions(questions) {
  if (!Array.isArray(questions) || questions.length === 0) {
    return { error: 'At least one question is required' };
  }

  for (const question of questions) {
    if (!question.text || typeof question.text !== 'string' || !question.text.trim()) {
      return { error: 'Every question needs text' };
    }
    if (question.type && !QUESTION_TYPES.includes(question.type)) {
      return { error: `Unsupported question type: ${question.type}` };
    }
    if (question.type === 'multiple-choice' &&
        (!Array.isArray(question.options) || question.options.length === 0)) {
      return { error: 'Multiple choice questions need at least one option' };
    }
  }

  return {};
}

const buildQuestionRequests = (questions) =>
  questions.map((question, index) => {
    const isText = question.type !== 'rating' && question.type !== 'multiple-choice';
    return {
      createItem: {
        item: {
          title: question.text.trim(),
          questionItem: {
            question: {
              required: Boolean(question.required),
              textQuestion: isText ? {
                paragraph: Boolean(question.long)
              } : undefined,
              scaleQuestion: question.type === 'rating' ? {
                low: 1,
                high: 5,
                lowLabel: 'Poor',
                highLabel: 'Excellent'
              } : undefined,
              choiceQuestion: question.type === 'multiple-choice' ? {
                type: 'RADIO',
                options: question.options.map(opt => ({ value: opt }))
              } : undefined
            }
          }
        },
        location: { index }
      }
    };
  });

// Google Form creation
const createForm = async (req, res) => {
  try {
    const { title, description, questions } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Form title is required' });
    }
    const { error: questionsError } = validateQuestions(questions);
    if (questionsError) {
      return res.status(400).json({ error: questionsError });
    }

    const admin = await Admin.findById(req.admin.id);

    const googleFormId = await callWithGoogleToken(admin, async (accessToken) => {
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      };

      const createResponse = await axios.post(
        'https://forms.googleapis.com/v1/forms',
        { info: { title: title.trim(), description: description || '' } },
        { headers }
      );

      const formId = createResponse.data.formId;

      await axios.post(
        `https://forms.googleapis.com/v1/forms/${formId}:batchUpdate`,
        { requests: buildQuestionRequests(questions) },
        { headers }
      );

      return formId;
    });

    const form = new Form({
      title: title.trim(),
      description: description || '',
      googleFormId,
      googleFormUrl: `https://docs.google.com/forms/d/${googleFormId}/viewform`,
      createdBy: req.admin.id
    });

    await form.save();

    res.status(201).json({
      message: 'Form created successfully! 🌸',
      form: {
        id: form._id,
        title: form.title,
        googleFormUrl: form.googleFormUrl
      }
    });
  } catch (err) {
    if (err instanceof GoogleTokenError) {
      return res.status(err.status).json({ error: err.message });
    }
    console.error('Failed to create form:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to create form' });
  }
};

const getForms = async (req, res) => {
  try {
    const forms = await Form.find({
      createdBy: req.admin.id
    }).sort({ createdAt: -1 });

    res.json(forms);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get forms' });
  }
};

// Getting responses for a specific form
const getFormResponses = async (req, res) => {
  try {
    const form = await Form.findById(req.params.formId);

    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    const admin = await Admin.findById(req.admin.id);

    const result = await callWithGoogleToken(admin, async (accessToken) => {
      const headers = { Authorization: `Bearer ${accessToken}` };
      const [schemaResponse, responsesResponse] = await Promise.all([
        axios.get(`https://forms.googleapis.com/v1/forms/${form.googleFormId}`, { headers }),
        axios.get(`https://forms.googleapis.com/v1/forms/${form.googleFormId}/responses`, { headers })
      ]);
      return { schema: schemaResponse.data, responses: responsesResponse.data.responses || [] };
    });

    res.json({
      form: {
        id: form._id,
        title: form.title,
        googleFormUrl: form.googleFormUrl
      },
      items: result.schema.items || [],
      responses: result.responses
    });
  } catch (err) {
    if (err instanceof GoogleTokenError) {
      return res.status(err.status).json({ error: err.message });
    }
    console.error('Failed to get responses:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to get responses' });
  }
};

// form deletion
const deleteForm = async (req, res) => {
  try {
    const form = await Form.findByIdAndDelete(req.params.formId);

    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    res.json({ message: 'Form deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete form' });
  }
};

module.exports = { createForm, getForms, getFormResponses, deleteForm };
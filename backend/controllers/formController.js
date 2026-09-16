const Form = require('../models/form');
const Admin = require('../models/admin');
const axios = require('axios');

    //  Google Form creation
const createForm = async (req, res) => {
    try {
        const { title, description, questions } = req.body;

        const admin = await Admin.findById(req.admin.id);
        const accessToken = admin.googleAccessToken;

        const createResponse = await axios.post(
            'https://forms.googleapis.com/v1/forms',
            { info: { title, description } },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const googleFormId = createResponse.data.formId;

        //   questions
        const requests = questions.map((question, index) => ({
            createItem: {
                item: {
            title: question.text,
            questionItem: {
            question: {
                required: question.required || false,
                textQuestion: question.type === 'text' ? {
                    paragraph: question.long || false
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
        }));

        await axios.post(
            `https://forms.googleapis.com/v1/forms/${googleFormId}:batchUpdate`,
            { requests },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        // Step 3 - Save in MongoDB
        const form = new Form({
            title,
            description,
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

    }  catch (err) {
        console.error('Full error:', JSON.stringify(err.response?.data, null, 2));
        console.error('Error message:', err.message);
        res.status(500).json({ 
            error: 'Failed to create form',
            details: err.response?.data || err.message 
    });
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
        const accessToken = admin.googleAccessToken;

        const response = await axios.get(
            `https://forms.googleapis.com/v1/forms/${form.googleFormId}/responses`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );

        res.json({
            form: {
                title: form.title,
                googleFormUrl: form.googleFormUrl
            },
            responses: response.data.responses || []
        });

    } catch (err) {
        console.error(err.response?.data || err);
        res.status(500).json({ error: 'Failed to get responses' });
    }
};

// form deletion
const deleteForm = async (req, res) => {
    try {
        const form = await Form.findById(req.params.formId);

        if (!form) {
            return res.status(404).json({ error: 'Form not found' });
        }

        await Form.findByIdAndDelete(req.params.formId);
        res.json({ message: 'Form deleted successfully' });

    } catch (err) {
        res.status(500).json({ error: 'Failed to delete form' });
    }
};

module.exports = { createForm, getForms, getFormResponses, deleteForm };
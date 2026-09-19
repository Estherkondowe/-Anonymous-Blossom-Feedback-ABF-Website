const NativeForm = require('../models/nativeForm');
const Response = require('../models/response');
const { validateFormPayload, slugify, uniqueSlug } = require('../utils/validateForm');

const PUBLIC_FORM_FIELDS = 'slug title description category questions settings stats.isPinned';

function applyQuestionIds(questions) {
  return questions.map((q, i) => ({
    ...q,
    id: typeof q.id === 'string' && q.id.trim() ? q.id : `q${i + 1}`
  }));
}

function formIsVisible(form) {
  if (!form || form.deletedAt) return false;
  if (!form.settings.active) return false;
  const now = new Date();
  if (form.settings.openAt && now < new Date(form.settings.openAt)) return false;
  if (form.settings.closeAt && now > new Date(form.settings.closeAt)) return false;
  return true;
}

function toPublicForm(form) {
  return {
    slug: form.slug,
    title: form.title,
    description: form.description,
    category: form.category,
    isPinned: form.isPinned,
    questions: form.questions.map(q => ({
      id: q.id,
      type: q.type,
      title: q.title,
      description: q.description,
      required: q.required,
      options: q.options,
      scale: q.scale,
      placeholder: q.placeholder
    })),
    responseCount: form.stats.responseCount
  };
}

const createForm = async (req, res) => {
  try {
    const errors = validateFormPayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join('. ') });
    }

    const { title, description, category, questions, settings } = req.body;
    const baseSlug = slugify(req.body.slug || title);
    const slug = await uniqueSlug(baseSlug, NativeForm);

    const form = await NativeForm.create({
      slug,
      title: title.trim(),
      description: (description || '').trim(),
      category: (category || '').trim(),
      createdBy: req.admin.id,
      questions: applyQuestionIds(questions),
      settings: {
        active: settings?.active ?? true,
        openAt: settings?.openAt || undefined,
        closeAt: settings?.closeAt || undefined,
        allowMultiple: settings?.allowMultiple ?? true
      }
    });

    res.status(201).json({
      message: 'Form created successfully! 🌸',
      form: {
        id: form._id,
        slug: form.slug,
        title: form.title,
        category: form.category,
        active: form.settings.active,
        responseCount: form.stats.responseCount,
        createdAt: form.createdAt
      }
    });
  } catch (err) {
    console.error('createForm error:', err.message);
    res.status(500).json({ error: 'Failed to create form' });
  }
};

const myForms = async (req, res) => {
  try {
    const forms = await NativeForm.find({ createdBy: req.admin.id, deletedAt: null })
      .sort({ createdAt: -1 })
      .select('slug title description category createdBy questions settings stats isPinned createdAt updatedAt');

    res.json(forms.map(f => ({
      id: f._id,
      slug: f.slug,
      title: f.title,
      description: f.description,
      category: f.category,
      active: f.settings.active,
      openAt: f.settings.openAt,
      closeAt: f.settings.closeAt,
      allowMultiple: f.settings.allowMultiple,
      responseCount: f.stats.responseCount,
      questionCount: f.questions.length,
      createdAt: f.createdAt
    })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to get forms' });
  }
};

const getForm = async (req, res) => {
  try {
    const form = await NativeForm.findOne({
      _id: req.params.id,
      createdBy: req.admin.id,
      deletedAt: null
    });
    if (!form) return res.status(404).json({ error: 'Form not found' });
    res.json(form);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get form' });
  }
};

const updateForm = async (req, res) => {
  try {
    const form = await NativeForm.findOne({
      _id: req.params.id,
      createdBy: req.admin.id,
      deletedAt: null
    });
    if (!form) return res.status(404).json({ error: 'Form not found' });

    const hasResponses = form.stats.responseCount > 0;

    const { title, description, category, questions, settings } = req.body;

    if (questions && !hasResponses) {
      const errors = validateFormPayload({ ...req.body, title: title || form.title });
      if (errors.length > 0) {
        return res.status(400).json({ error: errors.join('. ') });
      }
    }

    if (title !== undefined && title !== null && String(title).trim()) form.title = String(title).trim();
    if (description !== undefined) form.description = String(description || '').trim();
    if (category !== undefined) form.category = String(category || '').trim();

    if (questions && !hasResponses) {
      form.questions = applyQuestionIds(questions);
    }

    if (settings) {
      if (settings.active !== undefined) form.settings.active = Boolean(settings.active);
      if (settings.openAt !== undefined) form.settings.openAt = settings.openAt || undefined;
      if (settings.closeAt !== undefined) form.settings.closeAt = settings.closeAt || undefined;
      if (settings.allowMultiple !== undefined) form.settings.allowMultiple = Boolean(settings.allowMultiple);
    }

    await form.save();
    res.json({ message: 'Form updated successfully 🌸', form: toPublicForm(form) });
  } catch (err) {
    console.error('updateForm error:', err.message);
    res.status(500).json({ error: 'Failed to update form' });
  }
};

const softDelete = async (req, res) => {
  try {
    const form = await NativeForm.updateOne(
      { _id: req.params.id, createdBy: req.admin.id, deletedAt: null },
      { $set: { deletedAt: new Date(), 'settings.active': false } }
    );
    if (form.matchedCount === 0) return res.status(404).json({ error: 'Form not found' });
    res.json({ message: 'Form deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete form' });
  }
};

const duplicateForm = async (req, res) => {
  try {
    const form = await NativeForm.findOne({
      _id: req.params.id,
      createdBy: req.admin.id,
      deletedAt: null
    });
    if (!form) return res.status(404).json({ error: 'Form not found' });

    const slug = await uniqueSlug(form.slug + '-copy', NativeForm);
    const copy = await NativeForm.create({
      slug,
      title: `Copy of ${form.title}`,
      description: form.description,
      category: form.category,
      createdBy: req.admin.id,
      questions: form.questions.map(q => q.toObject()),
      settings: {
        ...form.settings.toObject(),
        active: false
      },
      stats: { responseCount: 0 }
    });

    res.status(201).json({
      message: 'Form duplicated 🌸',
      form: { id: copy._id, slug: copy.slug, title: copy.title, active: copy.settings.active }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to duplicate form' });
  }
};

const getPublicFormBySlug = async (req, res) => {
  try {
    const form = await NativeForm.findOne({ slug: req.params.slug }).select(PUBLIC_FORM_FIELDS);
    if (!formIsVisible(form)) {
      return res.status(404).json({ error: 'Form not found or not currently open' });
    }
    res.json(toPublicForm(form));
  } catch (err) {
    res.status(500).json({ error: 'Failed to get form' });
  }
};

const publicPortal = async (req, res) => {
  try {
    const forms = await NativeForm.find({ deletedAt: null })
      .sort({ isPinned: -1, createdAt: -1 })
      .select('slug title description category settings stats isPinned');

    const open = forms.filter(formIsVisible);

    res.json(open.map(f => ({
      slug: f.slug,
      title: f.title,
      description: f.description,
      category: f.category,
      isPinned: f.isPinned,
      responseCount: f.stats.responseCount
    })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to load forms' });
  }
};

const submitResponse = async (req, res) => {
  try {
    const form = await NativeForm.findOne({ slug: req.params.slug }).select('settings stats _id questions');

    if (!formIsVisible(form)) {
      return res.status(404).json({ error: 'Form not found or not currently open' });
    }

    const sentAnswers = Array.isArray(req.body.answers) ? req.body.answers : [];
    if (sentAnswers.length === 0) {
      return res.status(400).json({ error: 'No answers provided' });
    }

    const answersByQuestion = new Map(sentAnswers.map(a => [String(a.questionId), a.value]));
    const answerMap = new Map(form.questions.map(q => [q.id, q]));

    const answers = [];
    for (const [questionId, value] of answersByQuestion) {
      const question = answerMap.get(questionId);
      answers.push({ questionId, value: question?.type === 'rating' ? Number(value) : value });
    }

    const missingRequired = form.questions.some(q => q.required && !answersByQuestion.has(q.id));
    if (missingRequired) {
      return res.status(400).json({ error: 'Please fill in all required fields' });
    }

    await Response.create({
      form: form._id,
      answers,
      submittedAt: new Date()
    });

    await NativeForm.updateOne(
      { _id: form._id },
      { $inc: { 'stats.responseCount': 1 } }
    );

    res.status(201).json({ message: 'Feedback received. Thank you 🌸' });
  } catch (err) {
    console.error('submitResponse error:', err.message);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
};

const getResponses = async (req, res) => {
  try {
    const form = await NativeForm.findOne({
      _id: req.params.id,
      createdBy: req.admin.id,
      deletedAt: null
    }).select('title slug questions');
    if (!form) return res.status(404).json({ error: 'Form not found' });

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));

    const filter = { form: form._id };
    if (req.query.from) filter.submittedAt = { ...(filter.submittedAt || {}), $gte: new Date(req.query.from) };
    if (req.query.to) filter.submittedAt = { ...(filter.submittedAt || {}), $lte: new Date(req.query.to) };

    const [responses, total] = await Promise.all([
      Response.find(filter).sort({ submittedAt: -1 }).skip((page - 1) * limit).limit(limit),
      Response.countDocuments(filter)
    ]);

    res.json({
      form: { id: form._id, title: form.title, slug: form.slug },
      responses: responses.map(r => ({ id: r._id, submittedAt: r.submittedAt, answers: r.answers })),
      page,
      total
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get responses' });
  }
};

const exportCsv = async (req, res) => {
  try {
    const form = await NativeForm.findOne({
      _id: req.params.id,
      createdBy: req.admin.id,
      deletedAt: null
    }).select('title questions');
    if (!form) return res.status(404).json({ error: 'Form not found' });

    const responses = await Response.find({ form: form._id }).sort({ submittedAt: 1 });

    const columns = form.questions.map(q => q.title);
    const escape = (v) => {
      const s = v === null || v === undefined ? '' : String(v);
      return `"${s.replace(/"/g, '""')}"`;
    };

    const rows = [
      ['Submitted At', ...columns].map(escape).join(',')
    ];

    for (const r of responses) {
      const byQuestion = new Map(r.answers.map(a => [a.questionId, a.value]));
      const cells = columns.map((_, i) => {
        const q = form.questions[i];
        const value = byQuestion.get(q.id);
        return Array.isArray(value) ? value.join('; ') : value;
      });
      rows.push([r.submittedAt.toISOString(), ...cells].map(escape).join(','));
    }

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${form.slug || 'form'}-responses.csv"`);
    res.send('\uFEFF' + rows.join('\n'));
  } catch (err) {
    res.status(500).json({ error: 'Failed to export responses' });
  }
};

module.exports = {
  createForm,
  myForms,
  getForm,
  updateForm,
  softDelete,
  duplicateForm,
  getPublicFormBySlug,
  publicPortal,
  submitResponse,
  getResponses,
  exportCsv
};
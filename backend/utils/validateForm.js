const QUESTION_TYPES = ['text', 'paragraph', 'rating', 'multiple-choice', 'checkbox'];

function validateFormPayload(payload) {
  const errors = [];

  if (!payload.title || typeof payload.title !== 'string' || !payload.title.trim()) {
    errors.push('Form title is required');
  }

  const questions = payload.questions;
  if (!Array.isArray(questions) || questions.length === 0) {
    errors.push('At least one question is required');
    return errors;
  }

  questions.forEach((q, i) => {
    const label = `Question ${i + 1}`;
    if (!q.title || typeof q.title !== 'string' || !q.title.trim()) {
      errors.push(`${label}: title is required`);
    }
    if (q.type && !QUESTION_TYPES.includes(q.type)) {
      errors.push(`${label}: unsupported type "${q.type}"`);
    }
    if ((q.type === 'multiple-choice' || q.type === 'checkbox') &&
        (!Array.isArray(q.options) || q.options.length === 0)) {
      errors.push(`${label}: needs at least one option`);
    }
    if (q.type === 'rating' && q.scale &&
        (!Number.isInteger(q.scale.low) || !Number.isInteger(q.scale.high) || q.scale.high <= q.scale.low)) {
      errors.push(`${label}: rating scale must be integers with high > low`);
    }
  });

  return errors;
}

function slugify(text) {
  const slug = String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return slug || 'form';
}

async function uniqueSlug(base, Model) {
  let slug = base;
  let n = 2;
  while (await Model.findOne({ slug })) {
    slug = `${base}-${n}`;
    n += 1;
  }
  return slug;
}

module.exports = { validateFormPayload, slugify, uniqueSlug, QUESTION_TYPES };
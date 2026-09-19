const NativeForm = require('../models/nativeForm');
const Admin = require('../models/admin');
const { uniqueSlug } = require('./validateForm');

const UNIVERSAL_QUESTIONS = [
    {
        id: 'session',
        type: 'text',
        title: 'What are you giving feedback on?',
        required: true,
        placeholder: 'e.g. Curriculum, Mentor Hours sessions, All Hands Call etc.'
    },
    {
        id: 'mentor',
        type: 'text',
        title: 'Who is this feedback for?',
        required: true,
        placeholder: 'e.g. Code Blossom Team or General'
    },
    {
        id: 'message',
        type: 'paragraph',
        title: 'Share your honest thoughts freely',
        required: true,
        placeholder: 'You are safe here. Say what you really think.'
    },
    {
        id: 'rating',
        type: 'rating',
        title: 'How would you rate your experience with Code Blossom? (1-5)',
        required: true,
        scale: { low: 1, high: 5, lowLabel: 'Poor', highLabel: 'Excellent' }
    }
];

async function seedUniversalForm() {
    try {
        const existing = await NativeForm.findOne({ isPinned: true });
        if (existing) return;

        const slug = await uniqueSlug('universal-feedback', NativeForm);
        const owner = await Admin.findOne({ role: { $in: ['owner', 'coordinator'] } });

        await NativeForm.create({
            slug,
            title: 'Universal Anonymous Feedback',
            description: 'Anything on your mind about Code Blossom? Share it here — completely anonymously, no account needed.',
            category: 'General',
            createdBy: owner ? owner._id : undefined,
            questions: UNIVERSAL_QUESTIONS,
            settings: { active: true, allowMultiple: true },
            isPinned: true
        });

        console.log('🌸 Seeded universal feedback form (slug:', slug + ')');
    } catch (err) {
        console.error('seedUniversalForm error:', err.message);
    }
}

module.exports = seedUniversalForm;
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    id: { type: String, required: true },
    type: {
        type: String,
        enum: ['text', 'paragraph', 'rating', 'multiple-choice', 'checkbox'],
        default: 'text'
    },
    title: { type: String, required: true },
    description: String,
    required: { type: Boolean, default: false },
    options: [String],
    scale: {
        low: { type: Number, default: 1 },
        high: { type: Number, default: 5 },
        lowLabel: String,
        highLabel: String
    },
    placeholder: String
}, { _id: false });

const nativeFormSchema = new mongoose.Schema({
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: String,
    category: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'admin' },
    questions: [questionSchema],
    settings: {
        openAt: Date,
        closeAt: Date,
        active: { type: Boolean, default: true },
        allowMultiple: { type: Boolean, default: true }
    },
    stats: {
        responseCount: { type: Number, default: 0 }
    },
    isPinned: { type: Boolean, default: false },
    deletedAt: Date
}, { timestamps: true });

nativeFormSchema.index({ slug: 1 });
nativeFormSchema.index({ createdBy: 1, createdAt: -1 });
nativeFormSchema.index({ deletedAt: 1, settings: 1 });

module.exports = mongoose.model('NativeForm', nativeFormSchema);
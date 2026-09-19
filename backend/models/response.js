const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    questionId: { type: String, required: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true }
}, { _id: false });

const responseSchema = new mongoose.Schema({
    form: { type: mongoose.Schema.Types.ObjectId, ref: 'NativeForm', required: true },
    answers: [answerSchema],
    sentiment: { type: String, enum: ['positive', 'neutral', 'negative'] },
    submittedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

responseSchema.index({ form: 1, submittedAt: -1 });

module.exports = mongoose.model('Response', responseSchema);
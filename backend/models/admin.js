const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    name: {
        type: String
    },
    password: {
        type: String
    },
    role: {
        type: String,
        enum: ['owner', 'coordinator', 'mentor'],
        default: 'mentor'
    },
    isVerified: {
        type: Boolean,
        default: true
    },
    active: {
        type: Boolean,
        default: true
    },
    googleAccessToken: {
        type: String
    },
    googleRefreshToken: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('admin', adminSchema);

const mongoose = require('mongoose');

const strikes = new mongoose.Schema({
    userID: {
        type: String,
        unique: false,
        required: true,
    },
    reason: {
        type: String,
        unique: false,
        required: true,
    },
    guildID: {
        type: String,
        unique: false,
        required: true,
    },
    staffID: {
        type: String,
        unique: false,
        required: true,
    },
    evidence: {
        type: String,
        unique: false,
        required: true,
    }
}, { timestamps: true });

const MessageModel = module.exports = mongoose.model('strikes', strikes);

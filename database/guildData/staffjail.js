
const mongoose = require('mongoose');

const staffjail = new mongoose.Schema({
    userID: {
        type: String,
        unique: true,
        required: true,
    },
    reason: {
        type: String,
        unique: false,
        required: true,
    },
    oldRoles: {
        type: Array,
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
    }
}, { timestamps: true });

const MessageModel = module.exports = mongoose.model('staffjail', staffjail);


const mongoose = require('mongoose');

const whitelist = new mongoose.Schema({
    userID: {
        type: String,
        unique: true,
        required: true,
    },
}, { timestamps: true });

whitelist.statics.deleteById = function(userID) {
    return this.deleteOne({ userID: userID })
  };

const MessageModel = module.exports = mongoose.model('whitelist', whitelist);

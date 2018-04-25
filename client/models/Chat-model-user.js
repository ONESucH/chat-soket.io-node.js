const mongoose = require('mongoose'),
    ChatUsersSchema = new mongoose.Schema({
        name: String,
        family: String,
        nick: String,
        img: String,
        email: String,
        date_update: {type: Date, default: Date.now}
    });

module.exports = mongoose.model('Chat', ChatUsersSchema);
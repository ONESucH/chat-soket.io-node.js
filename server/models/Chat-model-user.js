const mongoose = require('mongoose'),
    ChatUsersSchema = new mongoose.Schema({
        name: String,
        content: String,
        user_id: String,
        nick: String,
        img: String,
        email: String,
        date: {type: Date}
    });

module.exports = mongoose.model('Chat', ChatUsersSchema);
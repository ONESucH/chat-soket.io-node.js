const mongoose = require('mongoose'),
    bcryptJs = require('bcryptjs'), // шифрует пароли
    ChatUsersSchema = new mongoose.Schema({
        name: String,
        content: String,
        user_id: String,
        password: String,
        nick: String,
        img: String,
        email: String,
        date: {type: Date, default: Date.now()}
    });

ChatUsersSchema.pre('save', (next) => {
        if (this.isModified('password') || this.isNew()) this.password = bcryptJs.hashSync(this.password, 12);
        next();
});

module.exports = mongoose.model('Chat', ChatUsersSchema);
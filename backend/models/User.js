const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String,  default: '' },
    user_name: {type: String, required: true},
    password: { type: String, required: true },
    created_date: {type:Date, default: Date.now()}, 
});

module.exports = mongoose.model('User', userSchema);
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String,  default: '' },
    completed: {type: Boolean, default: false},
    priority: { type: String, default: null },
    due_date: {type:Date, default: null}, 
    list_id: { type: mongoose.Schema.Types.ObjectId, ref: 'List' },  
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    clockify_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Clockify'},
    last_modified_date: { type: Date, default: Date.now }, 
});
 
module.exports = mongoose.model('Task', taskSchema);
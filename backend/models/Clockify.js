const mongoose = require('mongoose');

const ClockifySchema = new mongoose.Schema({
    task_id: { type: mongoose.Schema.Types.ObjectId, ref: "Task" }, // ✅ Needed for join
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    description: { type: String },
    start_time: { type: String, default: "00:00:00" },
    end_time: { type: String, default: "00:00:00" },
    is_active: { type: Boolean, default: true },
    is_paused: { type: Boolean, default: false },
    start_date: { type: Date, default: Date.now },
    end_date: { type: Date, default: Date.now },
    start_date: { type: Date, default: Date.now },
    elapsed_time: { type: Number, default: 0 },
    created_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Clockify', ClockifySchema, 'clockify');

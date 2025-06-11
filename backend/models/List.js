const mongoose = require('mongoose');

const ListSchema = mongoose.Schema({
    list_name:{type:String},
    created_date:{type:Date, default: Date.now }, 
})

module.exports = mongoose.model('List', ListSchema)
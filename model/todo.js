const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    completed: {type: Number, default: 0 },
    createdDate: {type: Date, default: Date.now }
})

module.exports = mongoose.model('Todos', UserSchema, 'todos')

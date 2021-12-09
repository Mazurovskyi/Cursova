const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: String,
    lastName: String,
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: String,
})

module.exports = mongoose.model('user', schema);

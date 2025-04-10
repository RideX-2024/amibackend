const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
    },
    first_name: {
        type: String,
    },
    last_name: {
        type: String,
    },
    display_name: {
        type: String
    },
    mobile_no: {
        type: String,
    },
    is_verified: {
        type: Boolean
    },
    security_code: {
        type: String
    },
    last_login: {
        type: Date
    },
    isTaxExempt: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['Active', 'Disable'], // Define the enum options here
        required: true
    },    
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },    
});

module.exports = mongoose.model('users', userSchema);

const mongoose = require('mongoose');

const quotationUserSchema = new mongoose.Schema({
    full_name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    company: {
        type: String,
        require: true
    },
    mobile_no: {
        type: String,
        require: true
    },
    zip_code: {
        type: String,
        require: true
    },
    address: {
        type: String,
        require: true
    },
    shipping_method: {
        type: String,
        require: true
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

module.exports = mongoose.model('quotation_users', quotationUserSchema);

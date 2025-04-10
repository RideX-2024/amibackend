const mongoose = require('mongoose');

const quotationUserLogSchema = new mongoose.Schema({
    quot_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'quotation_users',
        required: true
    },
    full_name: {
        type: String,
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

module.exports = mongoose.model('quotation_user_logs', quotationUserLogSchema);

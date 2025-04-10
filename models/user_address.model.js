const mongoose = require('mongoose');

const userAddressesSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    adress_type: {
        type: String,
        enum: ['Shipping', 'Billing'], // Define the enum options here
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    company: {
        type: String
    },
    stree_address: {
        type: String,
        required: true
    },
    town: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    zip_code: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
    mobile_no: {
        type: String,
    },
    status: {
        type: String,
        enum: ['Active', 'Disable'], // Define the enum options here
        default: 'Active',
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

module.exports = mongoose.model('user_addresses', userAddressesSchema);

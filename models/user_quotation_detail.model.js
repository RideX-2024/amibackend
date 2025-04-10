const mongoose = require('mongoose');

const userQuotationDetailSchema = new mongoose.Schema({
    quotation_master_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_quotation_masters',
        required: true
    },
    sequence_id: {
        type: Number,
        require: true
    },
    title: {
        type: String,
        require: true
    },
    value: {
        type: String,
        require: true,
    },
    price: {
        type: Number,
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

module.exports = mongoose.model('user_quotation_details', userQuotationDetailSchema);

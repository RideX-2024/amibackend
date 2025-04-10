const mongoose = require('mongoose');

const userQuotationMasterSchema = new mongoose.Schema({
    quotation_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'quotation_users',
        required: true
    },
    title: {
        type: String,
        require: true
    },
    status: {
        type: String,
        enum: ['New', 'Pending','Rejected','Completed'],
        default: 'New',
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

module.exports = mongoose.model('user_quotation_masters', userQuotationMasterSchema);

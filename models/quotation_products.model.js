const mongoose = require('mongoose');

const quotationProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String, 
        required: true
    },
    product_image: {
        type: String,
        required: true
    },
    material: {
        type: String,
        enum: ['Wood', 'Metal','Building'],
        required: true
    },
    type: {
        type: String,
        enum: ['Wood Door', 'Metal Door', 'Building Door', 'Frame Only'],
    },    
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active',
        required: true        
    },
    isImageShow: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Export the model
module.exports = mongoose.model('quotation_products', quotationProductSchema);

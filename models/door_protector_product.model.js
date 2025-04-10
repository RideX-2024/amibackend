const mongoose = require('mongoose');

const doorProtectProductSchema = new mongoose.Schema({
    door_protector_category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'door_protector_categories',
        required: true
    },    
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    product_image: {
        type: String,
    },
    price: {
        type: Number,
        default: 0.00,
        required: true
    },
    isMultiSelection: {
        type: String,
        enum: ['Yes', 'No'],
        default: 'No',
        //required: true        
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
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
    }
});

// Export the model
module.exports = mongoose.model('door_protector_products', doorProtectProductSchema);

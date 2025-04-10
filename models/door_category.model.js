const mongoose = require('mongoose');

const doorCategorySchema = new mongoose.Schema({
    quot_prod_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'quotation_products',
        require: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String, 
    },
    door_image: {
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
        enum: ['type', 'category', 'frame'],
        //enum: ['Wood Door', 'Metal Door', 'Building Door', 'Frame Only'],
        required: true
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
module.exports = mongoose.model('door_categories', doorCategorySchema);

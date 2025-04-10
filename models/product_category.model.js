const mongoose = require('mongoose');

const productCategorySchema = new mongoose.Schema({
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
        required: true
    },
    door_image: {
        type: String,
        required: true
    },
    material: {
        type: String,
        enum: ['Wood', 'Metal'],
        required: true
    },
    type: {
        type: String,
        enum: ['type', 'category'],
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
module.exports = mongoose.model('product_categories', productCategorySchema);

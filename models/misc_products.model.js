const mongoose = require('mongoose');

const miscProductSchema = new mongoose.Schema({
    misc_category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'misc_categories',
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
    product_rate: {
        type: Number,
        default: 0.00,
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
module.exports = mongoose.model('misc_products', miscProductSchema);

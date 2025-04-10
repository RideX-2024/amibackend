const mongoose = require('mongoose');

const hardwareProductSchema = new mongoose.Schema({
    hardware_category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'hardware_categories',
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
        default: ''
    },
    price: {
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
module.exports = mongoose.model('hardware_products', hardwareProductSchema);

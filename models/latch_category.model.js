const mongoose = require('mongoose');

const latchCategorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    latch_image: {
        type: String,
    },
    applied_on: {
        type: String,
        enum: ['Wood', 'Metal', 'Both','Building'],
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
module.exports = mongoose.model('latch_categories', latchCategorySchema);

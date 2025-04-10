const mongoose = require('mongoose');

const latchSubCategorySchema = new mongoose.Schema({
    latch_category_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'latch_categories',
        required: true
    }],
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
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
module.exports = mongoose.model('latch_sub_categories', latchSubCategorySchema);

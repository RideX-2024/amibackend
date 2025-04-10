const mongoose = require('mongoose');

const anchorTypeSchema = new mongoose.Schema({
    door_cat_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'door_categories',
        require: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    anchor_image: {
        type: String,
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
module.exports = mongoose.model('anchor_types', anchorTypeSchema);

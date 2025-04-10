const mongoose = require('mongoose');

const doorHeightSchema = new mongoose.Schema({
    size: {
        type: String,
        required: true
    },
    actual_size: {
        type: String, 
        required: true
    },
    popular: {
        type: String,
        enum: ['Yes', 'No'],
        default: 'No',
        required: true
    },
    material: {
        type: String,
        enum: ['Wood', 'Metal'],
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
module.exports = mongoose.model('door_height', doorHeightSchema);

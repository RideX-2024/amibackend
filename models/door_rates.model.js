const mongoose = require('mongoose');

const doorRatesSchema = new mongoose.Schema({
    door_type: {
        type: String,
        required: true
    },
    door_width: {
        type: String, 
        required: true
    },
    door_height: {
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
    category: {
        type: String,
        enum: ['Single', 'Double'],
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
module.exports = mongoose.model('door_rates', doorRatesSchema);

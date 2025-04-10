const mongoose = require('mongoose');

const doorTypeSchema = new mongoose.Schema({        
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
        enum: ['Wood', 'Metal'],
        required: true
    },
    type: {
        type: String,
        enum: ['Wood Door', 'Metal Door', 'Building Door', 'Frame Only'],
        required: true
    },
    door_rate: {
        type: Number,
        default: 0.00
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
module.exports = mongoose.model('door_types', doorTypeSchema);

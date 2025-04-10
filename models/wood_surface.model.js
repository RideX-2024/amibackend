const mongoose = require('mongoose');

const woodSurfaceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String, 
        required: true
    },
    surface_image: {
        type: String,
        required: true
    },
    surface_rate: {
        type: Number,
        default: 0.00,
        required: true
    },
    popular: {
        type: String,
        enum: ['Yes', 'No'],
        default: 'No',
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
module.exports = mongoose.model('wood_surfaces', woodSurfaceSchema);

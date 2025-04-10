const mongoose = require('mongoose');

const fireRatedSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    fire_rated_image: {
        type: String,
    },
    fire_rated_score: {
        type: Number,
        enum: [0,1,2,3,4],
        default: 0,
        required: true
    },
    material: {
        type: String,
        enum: ['Metal','Building'],
        default: 'Metal',
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
module.exports = mongoose.model('fire_rateds', fireRatedSchema);

const mongoose = require('mongoose');

const wallThicknessSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String, 
        required: true
    },
    wthickness_image: {
        type: String,
        required: true
    },
    material: {
        type: String,
        enum: ['Wood Stud Wall', 'Metal Stud Wall'],
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
module.exports = mongoose.model('wall_thickness', wallThicknessSchema);

const mongoose = require('mongoose');

const doorHandSchema = new mongoose.Schema({
    quot_prod_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'quotation_products',
        require: true
    },    
    title: {
        type: String,
    },
    short: {
        type: String,
    },
    description: {
        type: String, 
    },
    notes: {
        type: String, 
    },
    door_image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['Single', 'Double'],
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
module.exports = mongoose.model('door_hands', doorHandSchema);

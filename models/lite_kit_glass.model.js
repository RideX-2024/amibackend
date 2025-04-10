const mongoose = require('mongoose');

const liteKitGlassSchema = new mongoose.Schema({
    quot_prod_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'quotation_products',
        require: true
    },    
    title: {
        type: String,
        required: true
    },
    description: {
        type: String, 
    },
    lite_kit_image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        default: 0.00,
        required: true
    },
    fire_rated_score: {
        type: Number,
        enum: [0,1,2,3,4],
        default: 0,
        required: true
    },
    lite_kit_score: {
        type: Number,
        enum: [0,1,2,3,4],
        default: 0,
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
module.exports = mongoose.model('lite_kit_glasses', liteKitGlassSchema);

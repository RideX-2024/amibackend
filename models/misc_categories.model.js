const mongoose = require('mongoose');

const miscCategorySchema = new mongoose.Schema({
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
    misc_image: {
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
module.exports = mongoose.model('misc_categories', miscCategorySchema);

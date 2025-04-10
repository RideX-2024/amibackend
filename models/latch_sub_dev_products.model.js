const mongoose = require('mongoose');

const latchSubDevProductSchema = new mongoose.Schema({
    latch_sub_device_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'latch_sub_devices',
        required: true
    },    
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    latch_image: {
        type: String,
    },
    latch_rate: {
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
module.exports = mongoose.model('latch_sub_dev_products', latchSubDevProductSchema);

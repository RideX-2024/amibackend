const mongoose = require('mongoose');

const userJourneySchema = new mongoose.Schema({
    quot_prod_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'quotation_products',
        require: true
    },
    description: {
        type: String,
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
module.exports = mongoose.model('user_journey', userJourneySchema);

const mongoose = require('mongoose');

const jambDepthFrameSchema = new mongoose.Schema({
    door_cat_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'door_categories',
        require: true
    },    
    title: {
        type: String,
        required: true
    },
    description: {
        type: String, 
    },
    jambdepth_image: {
        type: String,
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
module.exports = mongoose.model('jamb_depth_frames', jambDepthFrameSchema);

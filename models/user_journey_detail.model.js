const mongoose = require('mongoose');

const userJourneyDetailSchema = new mongoose.Schema({
    user_journey_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_journey',
        require: true
    },
    sequence_id: {
        type: Number,
        require: true
    },
    title: {
        type: String,
    },
    quot_prod_cat_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'door_categories',
    }],
    quot_prod_type_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'door_categories',
    }],
    width_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'door_width',
    }],
    height_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'door_height',
    }],
    door_hand_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'door_hands',
    }],
    location_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'misc_products',
    }],
    fire_rated_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'fire_rated',
    }],
    lite_kit_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'lite_kit_glasses',
    }],
    louvers_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'louvers',
    }],
    quot_prod_frame_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'door_categories',
    }],
    anchor_type_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'anchor_types',
    }],
    jamb_depth_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'jamb_depth_frames',
    }],
    misc_cate_hang_door_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'misc_products',
    }],
    latch_category_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'latch_categories',
    }],
    latch_prod_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'latch_sub_categories',
    }],
    latch_sub_prod_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'latch_sub_devices',
    }],
    door_control_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'misc_products',
    }],
    door_protect_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'door_protector_categories',
    }],
    add_on_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'misc_products',
    }],
    hardware_finish_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'hardware_products',
    }],
    hardware_grade_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'hardware_products',
    }],
    hardware_brand_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'hardware_products',
    }],

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
module.exports = mongoose.model('user_journey_detail', userJourneyDetailSchema);

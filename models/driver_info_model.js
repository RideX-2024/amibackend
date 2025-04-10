const mongoose = require('mongoose');

const driverInfoSchema = new mongoose.Schema({
    mobile_no: {
        type: String,
        require: true
    },
    company_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company_infos',
	    require: true
    },
    driver_name: {
        type: String,
    },
    city: {
        type: String,
    },
    have_a_car: {
        type: Boolean,
    },
    car_type: {
        type: String,
    },
    car_model: {
        type: String,
    },
    car_number: {
        type: String,
    },
    mobile_code: {
        type: String,
    },
    licence_front: {
        type: String
    },
    licence_back: {
        type: String
    },    
    last_login: {
        type: Date
    },
    is_verified: {
        type: Boolean
    },
    security_code: {
        type: Number
    },
    password: {
        type: String,
    },
    fcm_token: {
        type: String,
    },
    status: {
        type: String,
        enum: ['Active', 'Disable'], // Define the enum options here
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },    
});

module.exports = mongoose.model('driver_infos', driverInfoSchema);
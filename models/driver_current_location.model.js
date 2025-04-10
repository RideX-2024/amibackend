const mongoose = require('mongoose');

const driverCurrentLocationSchema = new mongoose.Schema({
    driver_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'driver_infos',
	    require: true
    },    
    company_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company_infos',
	    require: true
    },
    car_type: {
        type: String,
        require: true
    },
    last_update_time: {
        type: Date,
	    require: true
    },
    current_location: {
        type: String,
	    require: true
    },
    current_latitude: {
        type: Number,
	    require: true
    },
    current_longitude: {
        type: Number,
	    require: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        }
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

// Create a 2dsphere index on the location field
driverCurrentLocationSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('driver_current_locations', driverCurrentLocationSchema);
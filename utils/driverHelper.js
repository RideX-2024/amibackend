const Driver = require('../models/driver_info_model'); // Adjust the path to your Driver model

// Function to retrieve the FCM token for a driver
async function getDeviceTokenForDriver(driver_id) {
    try {
        const driver = await Driver.findById(driver_id);
        return driver ? driver.fcm_token : null;
    } catch (error) {
        console.error('Error fetching device token:', error);
        return null;
    }
}

module.exports = { getDeviceTokenForDriver };

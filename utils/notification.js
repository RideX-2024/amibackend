const admin = require('../config/firebase'); // Import Firebase Admin
const axios = require('axios');
const { getDeviceTokenForDriver } = require('./driverHelper'); // Import helper function
const driverRequestQueue = require('../services/queueProcessor'); // Adjust path to your Bull queue instance

// Function to send a request to the driver
async function sendRequestToDriver(driver, company_id, user_id, user_payment_id, vehicle, pickUp_location, pickup_latitude, pickup_longitude, 
                destination_location, destination_latitude, destination_longitude) {
    const device_token = await getDeviceTokenForDriver(driver.driver_id);
    
    if (!device_token) {
        console.error('Device token not found for driver:', driver.driver_id);
        return false;
    }

    // Fetch distance and estimated time from Google Distance Matrix API
    const distanceAndTime = await getDistanceAndTime(pickup_latitude, pickup_longitude, driver.current_latitude, driver.current_longitude);
    if (!distanceAndTime) {
        console.error('Could not calculate distance and time');
        return false;
    }
    const { distance, duration } = distanceAndTime;

    const userRequest = await saveUserRequestData(user_id, driver.driver_id, company_id, user_payment_id, pickUp_location, pickup_latitude, pickup_longitude, 
        driver.current_location, driver.current_latitude, driver.current_longitude, distance, duration
    )
    //console.log(userRequest.userRequest._id);

    //console.log("Distance by google", distance)
    //console.log("Aprox time by google", duration)

    const message = {
        notification: {
            title: `Pickup location: ${pickUp_location}`,
            body: `Distance: ${distance} Duration: ${duration}`
        },
        data: {
            pickUp_location: pickUp_location,
            pickup_latitude: pickup_latitude.toString(), 
            pickup_longitude: pickup_longitude.toString(),
            destination_location: destination_location,
            destination_latitude: destination_latitude.toString(), 
            destination_longitude: destination_longitude.toString(),
            user_request_id: userRequest.userRequest._id
        },
        token: device_token
    };
    console.log(message);

    try {
        const response = await admin.messaging().send(message);
        console.log('Notification sent successfully:', response);

        // Wait for user's response (accept or reject) or timeout in 50 seconds
        return await waitForUserResponse(15 * 1000, userRequest.userRequest._id);
    } catch (error) {
        console.error('Error sending notification:', error);
        return false;
    }
}


async function waitForUserResponse(timeout, request_id) {
    const startTime = Date.now();

    return new Promise((resolve) => {
        let isResolved = false;

        // Define a function to poll the API
        async function pollUserResponse() {
            if (isResolved) return; // Stop polling if resolved

            try {
                const response = await getUserRequest(request_id);
                //console.log("User request response",response);
                if (response && response === 'Accepted') {
                    console.log("User accepted the request");
                    isResolved = true;
                    resolve(true); // Resolve with "accepted"
                } else if (response && response === 'Rejected') {
                    console.log("User rejected the request");
                    isResolved = true;
                    resolve(false); // Resolve with "rejected"
                } else if (response && response === 'Pending') {
                    // Continue polling if still pending and timeout not reached
                    if (Date.now() - startTime < timeout) {
                        setTimeout(pollUserResponse, 1000); // Poll every 1 second
                    } else {
                        console.log('No response from user within the time limit, rejecting...');
                        isResolved = true;
                        resolve(false); // Timeout reached, resolve as "rejected"
                    }
                }
            } catch (error) {
                console.error("Error checking user response:", error);
                resolve(false); // Reject in case of error
            }
        }

        // Start polling
        pollUserResponse();
    });
}

// Simulated event listener for notification actions
function listenForNotificationAction(action, callback) {
    // Replace this simulation with actual event handling logic for notification actions
    console.log(`Listening for ${action} action...`);
    // Example: Add your logic to trigger the callback when the user accepts or rejects
}

// Function to get distance and time using Google Maps Distance Matrix API
async function getDistanceAndTime(pickup_latitude, pickup_longitude, driver_latitude, driver_longitude) {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${driver_latitude},${driver_longitude}&destinations=${pickup_latitude},${pickup_longitude}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        if (data.status === 'OK') {
            const element = data.rows[0].elements[0];
            if (element.status === 'OK') {
                const distanceMeters = element.distance.value; // e.g., "5.6 km"
                const distanceKm = (distanceMeters / 1000).toFixed(2);
                const duration = element.duration.text; // e.g., "12 mins"
                return { distance: `${distanceKm} km`, duration };
            }
        }
        throw new Error('Distance Matrix API response error');
    } catch (error) {
        console.error('Error fetching distance and time:', error);
        return null;
    }
}


async function getUserRequest(id) {
    const url = `http://localhost:5000/api/userRequest/getByID/${id}`;

    try {
        const response = await axios.get(url);
        //console.log("Again in API",response);
        return response.data.userRequest.driver_response;
    } catch (error) {
        console.error('Error fetching user request data:', error);
        return null;
    }
}

async function saveUserRequestData(user_id, driver_id, company_id, user_payment_history_id, pickUp_location, pickup_latitude, pickup_longitude, driver_location, driver_latitude, 
    driver_longitude, distance, estimated_time) {

    const requestData = {
        user_id,
        driver_id,
        company_id,
        user_payment_history_id,
        pickUp_location,
        pickup_latitude,
        pickup_longitude,
        driver_location,
        driver_latitude,
        driver_longitude,
        distance: distance,
        estimated_time: estimated_time
    };
    console.log("User request", requestData);
    try {
        const response = await axios.post('http://localhost:5000/api/userRequest/create', requestData);
        if (response.status === 200) {
            //console.log('Data saved successfully:', response.data);
            return response.data;
        } else {
            throw new Error('Failed to save data');
        }
    } catch (error) {
        console.error('Error saving request data:', error);
        return null;
    }
}



module.exports = { sendRequestToDriver };

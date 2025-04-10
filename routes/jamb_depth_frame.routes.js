const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JambDepth = require('../models/jamb_depth_frame.model'); 
const router = express.Router();


// Get Jamb Depth of Frame by ID
router.get('/getById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        const data = await JambDepth.findById(id); 

        // Check if the Jamb Depth of Frame was found
        if (!data) {
            return res.status(404).json({ message: 'Data not found' });
        }

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Data', error });
    }
});


// Get All By Category
router.get('/getAllByCatId/:door_cat_id', async (req, res) => {
    try {
        const data = await JambDepth.find({ door_cat_id: door_cat_id});
        // Check if the Anchor Type was found
        if (!data) {
            return res.status(404).json({ message: 'data not found' });
        }

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Data', error });
    }
});


// Get All
router.get('/getAll/', async (req, res) => {
    try {
        const data = await JambDepth.find();

        // Check if the Jamb Depth of Frame was found
        if (!data) {
            return res.status(404).json({ message: 'Data not found' });
        }

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Data', error });
    }
});


// Create Jamb Depth of Frame
router.post('/create_jambdepth', async (req, res) => {
    const { door_cat_id, title, description, jambdepth_image } = req.body;
    try {
        let data
        const checkProduct = await JambDepth.find({ title: title });
        //console.log(checkProduct);
        data = new JambDepth({ door_cat_id, title, description, jambdepth_image });
        await data.save();

        res.status(200).json({ message: 'Data created successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error creating Data', error });
    }
}); 


router.put('/update_jambdepth/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters
    const { title, description, jambdepth_image, status } = req.body;

    try {
        const data = await JambDepth.findByIdAndUpdate(
            id,
            { title, description, jambdepth_image, status, updatedAt: Date.now() },
            { new: true, runValidators: true } // Return the updated document and validate
        );
        // Check if the Jamb Depth of Frame was found
        if (!data) {
            return res.status(404).json({ message: 'Data not found' });
        }
        
        res.status(200).json({ message: 'Data updated successfully'});
    } catch (error) {
        res.status(400).json({ message: 'Error updating Data', error });
    }
});

// Delete Jamb Depth of Frame by ID
router.delete('/deleteById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        
        const deletedData = await JambDepth.findByIdAndDelete(id); // Find and delete the Jamb Depth of Frame
        //console.log(deletedDoor);
        // Check if the Jamb Depth of Frame was found
        if (!deletedData) {
            return res.status(404).json({ message: 'Data not found' });
        }

        res.status(200).json({ message: 'Data deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting Data', error });
    }
});

module.exports = router;

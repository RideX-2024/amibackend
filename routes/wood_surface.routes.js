const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const WoodSurface = require('../models/wood_surface.model'); 
const router = express.Router();


// Get Wood Surface by ID
router.get('/getById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        const data = await WoodSurface.findById(id); 

        // Check if the Wood Surface was found
        if (!data) {
            return res.status(404).json({ message: 'Wood Surface not found' });
        }

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Wood Surface', error });
    }
});

// Get All
router.get('/getAll/', async (req, res) => {
    try {
        const data = await WoodSurface.find();

        // Check if the Wood Surface was found
        if (!data) {
            return res.status(404).json({ message: 'Wood Surface not found' });
        }

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Wood Surface', error });
    }
});

// Create Wood Surface
router.post('/create_woodsurface', async (req, res) => {
    const { title, description, surface_image, surface_rate, popular } = req.body;
    try {
        let data
        const checkProduct = await WoodSurface.find({ title: title });
        //console.log(checkProduct);
        data = new WoodSurface({ title, description, surface_image, surface_rate, popular });
        await data.save();

        res.status(200).json({ message: 'Wood Surface created successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error creating Wood Surface', error });
    }
}); 


router.put('/update_woodsurface/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters
    const { title, description, surface_image, surface_rate, popular, status } = req.body;

    try {
        const data = await WoodSurface.findByIdAndUpdate(
            id,
            { title, description, surface_image, surface_rate, popular, status, updatedAt: Date.now() },
            { new: true, runValidators: true } // Return the updated document and validate
        );
        // Check if the Wood Surface was found
        if (!data) {
            return res.status(404).json({ message: 'Wood Surface not found' });
        }
        
        res.status(200).json({ message: 'Wood Surface updated successfully'});
    } catch (error) {
        res.status(400).json({ message: 'Error updating Wood Surface', error });
    }
});

// Delete Wood Surface by ID
router.delete('/deleteById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        
        const deletedData = await WoodSurface.findByIdAndDelete(id); // Find and delete the Wood Surface
        //console.log(deletedDoor);
        // Check if the Wood Surface was found
        if (!deletedData) {
            return res.status(404).json({ message: 'Wood Surface not found' });
        }

        res.status(200).json({ message: 'Wood Surface deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting Wood Surface', error });
    }
});

module.exports = router;

const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const WallThickness = require('../models/wall_thickness.model'); 
const router = express.Router();


// Get Wall Thickness by ID
router.get('/getById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        const data = await WallThickness.findById(id); 

        // Check if the Wall Thickness was found
        if (!data) {
            return res.status(404).json({ message: 'Data not found' });
        }

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Data', error });
    }
});
// Get By material
router.get('/getByMaterial/:material', async (req, res) => {
    const { material } = req.params; 
    try {
        const data = await WallThickness.find({ material: material }); 

        // Check if the Wall Thickness was found
        if (!data) {
            return res.status(404).json({ message: 'Data not found' });
        }

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Data', error });
    }
});

// Get All
router.get('/getAll/', async (req, res) => {
    try {
        const data = await WallThickness.find();

        // Check if the Wall Thickness was found
        if (!data) {
            return res.status(404).json({ message: 'Data not found' });
        }

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Data', error });
    }
});

// Create Wall Thickness
router.post('/create_wallthickness', async (req, res) => {
    const { title, description, wthickness_image, material } = req.body;
    try {
        let data
        const checkProduct = await WallThickness.find({ title: title });
        //console.log(checkProduct);
        data = new WallThickness({ title, description, wthickness_image, material });
        await data.save();

        res.status(200).json({ message: 'Data created successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error creating Data', error });
    }
}); 


router.put('/update_wallthickness/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters
    const { title, description, wthickness_image, material, status } = req.body;

    try {
        const data = await WallThickness.findByIdAndUpdate(
            id,
            { title, description, wthickness_image, material, status, updatedAt: Date.now() },
            { new: true, runValidators: true } // Return the updated document and validate
        );
        // Check if the Wall Thickness was found
        if (!data) {
            return res.status(404).json({ message: 'Data not found' });
        }
        
        res.status(200).json({ message: 'Data updated successfully'});
    } catch (error) {
        res.status(400).json({ message: 'Error updating Data', error });
    }
});

// Delete Wall Thickness by ID
router.delete('/deleteById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        
        const deletedData = await WallThickness.findByIdAndDelete(id); // Find and delete the Wall Thickness
        //console.log(deletedDoor);
        // Check if the Wall Thickness was found
        if (!deletedData) {
            return res.status(404).json({ message: 'Data not found' });
        }

        res.status(200).json({ message: 'Data deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting Data', error });
    }
});

module.exports = router;

const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const DoorCategory = require('../models/door_category.model');
const DoorType = require('../models/door_type.model');
const router = express.Router();


// Get Door Type by ID
router.get('/getById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        const doorType = await DoorType.findById(id); 

        // Check if the company was found
        if (!doorType) {
            return res.status(404).json({ message: 'Door Type not found' });
        }

        res.status(200).json({ doorType });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Door Type', error });
    }
});

// Get By material
router.get('/getByType/:type', async (req, res) => {
    const { type } = req.params; 
    try {
        const data = await DoorType.find({ type: type }); 

        // Check if the Data Type was found
        if (!data) {
            return res.status(404).json({ message: 'Door Type not found' });
        }

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Data Type', error });
    }
});

// Get All
router.get('/getAll/', async (req, res) => {
    try {
        const doorType = await DoorType.find();

        // Check if the company was found
        if (!doorType) {
            return res.status(404).json({ message: 'Door Type not found' });
        }

        res.status(200).json({ doorType });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Door Type', error });
    }
});

// Create door Type
router.post('/create_door_type', async (req, res) => {
    const { title, description, door_image, material, type, door_rate } = req.body;
    try {
        let doorType
        const checkProduct = await DoorType.find({ title: title });
        doorType = new DoorType({ title, description, door_image, material, type, door_rate });
        await doorType.save();

        res.status(200).json({ message: 'Door Type created successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error creating Door Type', error });
        console.log(error);
    }
}); 


router.put('/update_door_type/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters
    const { title, description, door_image, material, type, door_rate, status } = req.body;

    try {
        const doorType = await DoorType.findByIdAndUpdate(
            id,
            { title, description, door_image, material, type, door_rate, status, updatedAt: Date.now() },
            { new: true, runValidators: true } // Return the updated document and validate
        );
        // Check if the Door Type was found
        if (!doorType) {
            return res.status(404).json({ message: 'Door Type not found' });
        }
        
        res.status(200).json({ message: 'Door Type updated successfully'});
    } catch (error) {
        res.status(400).json({ message: 'Error updating Door Type', error });
    }
});

// Delete door Type by ID
router.delete('/deleteById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        const deletedDoor = await DoorType.findByIdAndDelete(id); // Find and delete the door type
        //console.log(deletedDoor);
        // Check if the company was found
        if (!deletedDoor) {
            return res.status(404).json({ message: 'Door Type not found' });
        }

        res.status(200).json({ message: 'Door Type deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting Door Type', error });
    }
});

module.exports = router;

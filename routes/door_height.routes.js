const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const DoorHeight = require('../models/door_height.model'); 
const router = express.Router();


// Get Company by ID
router.get('/getById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        const doorheight = await DoorHeight.findById(id); // Find the company by ID

        // Check if the company was found
        if (!doorheight) {
            return res.status(404).json({ message: 'Door height not found' });
        }

        res.status(200).json({ doorheight });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving door height', error });
    }
});

// Get By Category and material
router.get('/getByMaterial/:material', async (req, res) => {
    const { material } = req.params; // Get the ID from the request parameters
    try {
        const doorHeight = await DoorHeight.find({ material: material }).sort({ _id: 1 }); // Find the company by ID

        // Check if the company was found
        if (!doorHeight) {
            return res.status(404).json({ message: 'Door height not found' });
        }

        res.status(200).json({ doorHeight });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving door height', error });
    }
});

// Get All
router.get('/getAll/', async (req, res) => {
    try {
        const doorHeight = await DoorHeight.find();

        // Check if the company was found
        if (!doorHeight) {
            return res.status(404).json({ message: 'Door width not found' });
        }

        res.status(200).json({ doorHeight });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving door width', error });
    }
});

// Create door heights
router.post('/create_door_height', async (req, res) => {
    const { size, actual_size, popular, material } = req.body;
    try {
        let doorHeight
        const checkHeight = await DoorHeight.find({ size: size });
        doorHeight = new DoorHeight({ size, actual_size, popular, material });
        await doorHeight.save();

        res.status(200).json({ message: 'Door height created successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error creating door height', error });
    }
}); 


router.put('/update_door_height/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters
    const { size, actual_size, popular, material } = req.body;
    
    try {
        const doorHeight = await DoorHeight.findByIdAndUpdate(
            id,
            { size, actual_size, popular, material, updatedAt: Date.now() },
            { new: true, runValidators: true } // Return the updated document and validate
        );
        // Check if the company rate was found
        if (!doorHeight) {
            return res.status(404).json({ message: 'Door height not found' });
        }
        
        res.status(200).json({ message: 'door height updated successfully'});
    } catch (error) {
        res.status(400).json({ message: 'Error updating door height', error });
    }
});

// Delete door height by ID
router.delete('/deleteById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        
        const deletedDoor = await DoorHeight.findByIdAndDelete(id); // Find and delete the company
        //console.log(deletedDoor);
        // Check if the company was found
        if (!deletedDoor) {
            return res.status(404).json({ message: 'Door height not found' });
        }

        res.status(200).json({ message: 'Door height deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting Door height', error });
    }
});

module.exports = router;

const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const DoorWidth = require('../models/door_width.model'); 
const router = express.Router();


// Get Company by ID
router.get('/getById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        const doorWidth = await DoorWidth.findById(id); // Find the company by ID

        // Check if the company was found
        if (!doorWidth) {
            return res.status(404).json({ message: 'Door width not found' });
        }

        res.status(200).json({ doorWidth });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving door width', error });
    }
});

// Get Door Width by ID
router.get('/getByMaterial/:material', async (req, res) => {
    const { material } = req.params; // Get the ID from the request parameters
    try {
        let doorWidth
        if (material == 'Metal' || material == 'Wood'){
            doorWidth = await DoorWidth.find({ material: { $in: [material, "Both"] } }).sort({ _id: 1 }); // Find the company by ID
        } else {
            doorWidth = await DoorWidth.find({ material: { $in: [material] } }).sort({ _id: 1 }); // Find the company by ID
        }
        

        // Check if the company was found
        if (!doorWidth) {
            return res.status(404).json({ message: 'Door width not found' });
        }

        res.status(200).json({ doorWidth });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving door width', error });
    }
});


// Get Company by ID
router.get('/getByCategory/:category/:material', async (req, res) => {
    const { category, material } = req.params; // Get the ID from the request parameters
    try {
        const doorWidth = await DoorWidth.find({ category: category, material: { $in: [material, "Both"] } }).sort({ _id: -1 }); // Find the company by ID

        // Check if the company was found
        if (!doorWidth) {
            return res.status(404).json({ message: 'Door width not found' });
        }

        res.status(200).json({ doorWidth });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving door width', error });
    }
});

// Get All
router.get('/getAll/', async (req, res) => {
    try {
        const doorWidth = await DoorWidth.find();

        // Check if the company was found
        if (!doorWidth) {
            return res.status(404).json({ message: 'Door width not found' });
        }

        res.status(200).json({ doorWidth });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving door width', error });
    }
});


// Create door heights
router.post('/create_door_width', async (req, res) => {
    const { size, actual_size, popular, material, category } = req.body;
    try {
        const doorWidth = new DoorWidth({ size, actual_size, popular, material, category });
        await doorWidth.save();
        res.status(200).json({ message: 'Door width created successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error creating door width', error });
    }
}); 

router.put('/update_door_width/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters
    const { size, actual_size, popular, material, category } = req.body;
    //console.log(req.body);
    try {
        const doorWidth = await DoorWidth.findByIdAndUpdate(
            id,
            { size, actual_size, popular, material, category, updatedAt: Date.now() },
            { new: true, runValidators: true } // Return the updated document and validate
        );
        // Check if the company rate was found
        if (!doorWidth) {
            return res.status(404).json({ message: 'Door Width not found' });
        }
        
        res.status(200).json({ message: 'door width updated successfully'});
    } catch (error) {
        res.status(400).json({ message: 'Error updating door width', error });
    }
});

// Delete door height by ID
router.delete('/deleteById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        
        const deletedDoor = await DoorWidth.findByIdAndDelete(id); // Find and delete the company
        //console.log(deletedDoor);
        // Check if the company was found
        if (!deletedDoor) {
            return res.status(404).json({ message: 'Door width not found' });
        }

        res.status(200).json({ message: 'Door width deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting Door width', error });
    }
});

module.exports = router;
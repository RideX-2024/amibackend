const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AnchorType = require('../models/anchor_type.model'); 
const router = express.Router();


// Get Anchor Type by ID
router.get('/getById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        const data = await AnchorType.findById(id); 

        // Check if the Anchor Type was found
        if (!data) {
            return res.status(404).json({ message: 'Anchor Type not found' });
        }

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Anchor Type', error });
    }
});

// Get All By Category
router.get('/getAllByCatId/:door_cat_id', async (req, res) => {
    try {
        const data = await AnchorType.find({ door_cat_id: door_cat_id});
        // Check if the Anchor Type was found
        if (!data) {
            return res.status(404).json({ message: 'Anchor Type not found' });
        }

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Anchor Type', error });
    }
});

// Get All
router.get('/getAll/', async (req, res) => {
    try {
        const data = await AnchorType.find();
        // Check if the Anchor Type was found
        if (!data) {
            return res.status(404).json({ message: 'Anchor Type not found' });
        }

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Anchor Type', error });
    }
});

// Create Anchor Type
router.post('/create_anchor_type', async (req, res) => {
    const { door_cat_id, title, description, anchor_image, price } = req.body;
    //console.log(req.body);
    try {
        let data
        const checkProduct = await AnchorType.find({ title: title });
        //console.log(checkProduct);
        data = new AnchorType({ door_cat_id, title, description, anchor_image, price });
        //console.log(data);
        await data.save();

        res.status(200).json({ message: 'Anchor Type created successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error creating Anchor Type', error });
    }
}); 


router.put('/update_anchor_type/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters
    const { title, description, anchor_image, price, status } = req.body;

    try {
        const data = await AnchorType.findByIdAndUpdate(
            id,
            { title, description, anchor_image, price, status, updatedAt: Date.now() },
            { new: true, runValidators: true } // Return the updated document and validate
        );
        // Check if the Anchor Type was found
        if (!data) {
            return res.status(404).json({ message: 'Anchor Type not found' });
        }
        
        res.status(200).json({ message: 'Anchor Type updated successfully'});
    } catch (error) {
        res.status(400).json({ message: 'Error updating Anchor Type', error });
    }
});

// Delete Anchor Type by ID
router.delete('/deleteById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        
        const deletedAnchorType = await AnchorType.findByIdAndDelete(id); // Find and delete the Anchor Type
        //console.log(deletedDoor);
        // Check if the Anchor Type was found
        if (!deletedAnchorType) {
            return res.status(404).json({ message: 'Anchor Type not found' });
        }

        res.status(200).json({ message: 'Anchor Type deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting Anchor Type', error });
    }
});

module.exports = router;

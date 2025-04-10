const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const DoorHand = require('../models/door_hand.model'); 
const router = express.Router();


// Get Door Hand by ID
router.get('/getById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        const data = await DoorHand.findById(id); 

        // Check if the Door Hand was found
        if (!data) {
            return res.status(404).json({ message: 'Door Hand not found' });
        }

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Door Hand', error });
    }
});

// Get By product id
router.get('/getByProductId/:quot_prod_id/', async (req, res) => {
    const { quot_prod_id } = req.params; 
    try {
        const data = await DoorHand.find({  quot_prod_id: quot_prod_id }); 

        // Check if the Door Hand was found
        if (!data) {
            return res.status(404).json({ message: 'Door Hand not found' });
        }

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Door Hand', error });
    }
});

// Get By material
router.get('/getByCategory/:type/:category/', async (req, res) => {
    const { type, category } = req.params; 
    try {
        const data = await DoorHand.find({  type: type, category: category }); 

        // Check if the Door Hand was found
        if (!data) {
            return res.status(404).json({ message: 'Door Hand not found' });
        }

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Door Hand', error });
    }
});
// Get All
router.get('/getAll/', async (req, res) => {
    try {
        const data = await DoorHand.find();

        // Check if the Door Hand was found
        if (!data) {
            return res.status(404).json({ message: 'Door Hand not found' });
        }

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Door Hand', error });
    }
});

// Create Door Hand
router.post('/create_doorhand', async (req, res) => {
    const { quot_prod_id, title, short, description, notes, door_image, category } = req.body;
    try {
        let data
        const checkProduct = await DoorHand.find({ title: title });
        //console.log(checkProduct);
        data = new DoorHand({ quot_prod_id, title, short, description, notes, door_image, category });
        await data.save();

        res.status(200).json({ message: 'Door Hand created successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error creating Door Hand', error });
    }
}); 


router.put('/update_doorhand/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters
    const { title, short, description, notes, door_image, category, status } = req.body;
    //console.log("Data are as below");
    //console.log(req.body);
    //console.log(id)
    try {
        const data = await DoorHand.findByIdAndUpdate(
            id,
            { title, short, description, notes, door_image, category, status, updatedAt: Date.now() },
            { new: true, runValidators: true } // Return the updated document and validate
        );
        // Check if the Door Hand was found
        if (!data) {
            return res.status(404).json({ message: 'Door Hand not found' });
        }
        
        res.status(200).json({ message: 'Door Hand updated successfully'});
    } catch (error) {
        res.status(400).json({ message: 'Error updating Door Hand', error });
    }
});

// Delete Door Hand by ID
router.delete('/deleteById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        
        const deletedData = await DoorHand.findByIdAndDelete(id); // Find and delete the Door Hand
        //console.log(deletedDoor);
        // Check if the Door Hand was found
        if (!deletedData) {
            return res.status(404).json({ message: 'Door Hand not found' });
        }

        res.status(200).json({ message: 'Door Hand deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting Door Hand', error });
    }
});

module.exports = router;

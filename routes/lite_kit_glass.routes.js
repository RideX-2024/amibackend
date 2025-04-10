const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const LiteKitGlass = require('../models/lite_kit_glass.model');
const router = express.Router();


// Get Company by ID
router.get('/getById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        const liteKit = await LiteKitGlass.findById(id); 

        // Check if the company was found
        if (!liteKit) {
            return res.status(404).json({ message: 'Lite Kit with Glass not found' });
        }

        res.status(200).json({ liteKit });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Lite Kit with Glass', error });
    }
});
/*
// Get By Fire Rated
router.get('/getByFireRated/:fire_rated_score', async (req, res) => {
    try {
        const liteKit = await LiteKitGlass.find({ fire_rated_score });

        // Check if the Lite Kit with Glass was found
        if (!liteKit) {
            return res.status(404).json({ message: 'Lite Kit with Glass not found' });
        }

        res.status(200).json({ liteKit });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Lite Kit with Glass', error });
    }
});
*/

// Get By product id
router.get('/getByProductId/:quot_prod_id/', async (req, res) => {
    const { quot_prod_id } = req.params; 
    try {
        const data = await LiteKitGlass.find({  quot_prod_id: quot_prod_id }); 

        // Check if the Door Hand was found
        if (!data) {
            return res.status(404).json({ message: 'Lite Kit with Glass not found' });
        }

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Lite Kit with Glass', error });
    }
});

// Get By Fire Rated
router.get('/getByFireRatedScore/:score', async (req, res) => {
    const { score } = req.params; // Get the score from request parameters
    let liteKits
    try {

        const fireRatedScore = parseInt(score, 10); // Convert score to an integer

        if (isNaN(fireRatedScore)) {
            return res.status(400).json({ message: 'Invalid fire_rated_score value' });
        }
        if (fireRatedScore > 0){
            liteKits = await LiteKitGlass.find({ fire_rated_score: { $lte: fireRatedScore } });
        } else {
            liteKits = await LiteKitGlass.find();
        }

        res.status(200).json({ liteKits });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Lite Kit with Glass', error });
    }
});


// Get All
router.get('/getAll/', async (req, res) => {
    try {
        const liteKit = await LiteKitGlass.find().sort({ _id: 1 });

        // Check if the Lite Kit with Glass was found
        if (!liteKit) {
            return res.status(404).json({ message: 'Lite Kit with Glass not found' });
        }

        res.status(200).json({ liteKit });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Lite Kit with Glass', error });
    }
});

// Create Lite Kit with Glass
router.post('/create_litekit', async (req, res) => {
    const { quot_prod_id,title, description, lite_kit_image, price, fire_rated_score, lite_kit_score } = req.body;
    try {
        let liteKit
        const checkProduct = await LiteKitGlass.find({ title: title });
        //console.log(checkProduct);
        liteKit = new LiteKitGlass({ quot_prod_id,title, description, lite_kit_image, price, fire_rated_score, lite_kit_score });
        await liteKit.save();

        res.status(200).json({ message: 'Lite Kit with Glass created successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error creating Lite Kit with Glass', error });
    }
});


router.put('/update_litekit/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters
    const { title, description, lite_kit_image, price, fire_rated_score, lite_kit_score, status } = req.body;

    try {
        const liteKit = await LiteKitGlass.findByIdAndUpdate(
            id,
            { title, description, lite_kit_image, price, fire_rated_score, lite_kit_score, status, updatedAt: Date.now() },
            { new: true, runValidators: true } // Return the updated document and validate
        );
        // Check if the Lite Kit with Glass rate was found
        if (!liteKit) {
            return res.status(404).json({ message: 'Lite Kit with Glass not found' });
        }
        
        res.status(200).json({ message: 'Lite Kit with Glass updated successfully'});
    } catch (error) {
        res.status(400).json({ message: 'Error updating Lite Kit with Glass', error });
    }
});

// Delete Lite Kit with Glass by ID
router.delete('/deleteById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        
        const deletedLiteKit = await LiteKitGlass.findByIdAndDelete(id); // Find and delete the Lite Kit with Glass
        //console.log(deletedDoor);
        // Check if the Lite Kit with Glass was found
        if (!deletedLiteKit) {
            return res.status(404).json({ message: 'Lite Kit with Glass not found' });
        }

        res.status(200).json({ message: 'Lite Kit with Glass deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting Lite Kit with Glass', error });
    }
});

module.exports = router;

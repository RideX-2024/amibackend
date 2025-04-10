const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const LiteKitGlass = require('../models/lite_kit_glass.model');
const Louver = require('../models/louver.model');
const router = express.Router();


// Get Louver by ID
router.get('/getById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        const louver = await Louver.findById(id); 

        // Check if the Louver was found
        if (!louver) {
            return res.status(404).json({ message: 'Louver not found' });
        }

        res.status(200).json({ louver });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Louver', error });
    }
});

// Get By Fire Rated
router.get('/getByFrlkS/:fscore/:lscore', async (req, res) => {
    const { fscore, lscore } = req.params; // Get the score from request parameters
    let liteKits
    try {

        const fireRatedScore = parseInt(fscore, 10); 
        const liteKitScore = parseInt(lscore, 10); 
        
        if (isNaN(fireRatedScore)) {
            return res.status(400).json({ message: 'Invalid fire_rated_score value' });
        }

        if (isNaN(liteKitScore)) {
            return res.status(400).json({ message: 'Invalid lite_kit_score value' });
        }
        //console.log(fireRatedScore);
        //console.log(liteKitScore);


        if (fireRatedScore > 1 && liteKitScore == 0){
            //console.log(fireRatedScore);
            //console.log(liteKitScore);  
            //console.log("condition 1");            
            
            liteKits = await Louver.find({ lite_kit_score: liteKitScore });
        } else if (fireRatedScore == 0 && liteKitScore == 1){
            //console.log(fireRatedScore);
            //console.log(liteKitScore);
            //console.log("condition 2");

            liteKits = await Louver.find({ fire_rated_score: fireRatedScore });
        } else if (fireRatedScore == 0 && liteKitScore == 0){
            //console.log(fireRatedScore);
            //console.log(liteKitScore);
            //console.log("condition 3");
            
            liteKits = await Louver.find();
        }

        res.status(200).json({ liteKits });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Lite Kit with Glass', error });
    }
});

// Get By product id
router.get('/getByProductId/:quot_prod_id/', async (req, res) => {
    const { quot_prod_id } = req.params; 
    try {
        const data = await Louver.find({  quot_prod_id: quot_prod_id, status: 'Active' }); 

        // Check if the Door Hand was found
        if (!data) {
            return res.status(404).json({ message: 'Louver not found' });
        }

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Louver', error });
    }
});

// Get All
router.get('/getAll/', async (req, res) => {
    try {
        const louver = await Louver.find({ status: 'Active' }).sort({ _id: 1 });

        // Check if the Louver was found
        if (!louver) {
            return res.status(404).json({ message: 'Louver not found' });
        }

        res.status(200).json({ louver });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Lite Kit with Glass', error });
    }
});

// Create Louver
router.post('/create_louver', async (req, res) => {
    const { quot_prod_id,title, description, louver_image, price, fire_rated_score, lite_kit_score } = req.body;
    try {
        let louver
        const checkProduct = await Louver.find({ title: title });
        //console.log(checkProduct);
        louver = new Louver({ quot_prod_id,title, description, louver_image, price, fire_rated_score, lite_kit_score });
        await louver.save();

        res.status(200).json({ message: 'Louver created successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error creating Louver', error });
    }
});


router.put('/update_louver/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters
    const { title, description, louver_image, price, fire_rated_score, lite_kit_score, status } = req.body;

    try {
        const louver = await Louver.findByIdAndUpdate(
            id,
            { title, description, louver_image, price, fire_rated_score, lite_kit_score, status, updatedAt: Date.now() },
            { new: true, runValidators: true } // Return the updated document and validate
        );
        // Check if the Louver was found
        if (!louver) {
            return res.status(404).json({ message: 'Louver not found' });
        }
        
        res.status(200).json({ message: 'Louver updated successfully'});
    } catch (error) {
        res.status(400).json({ message: 'Error updating Louver', error });
    }
});

// Delete Louver by ID
router.delete('/deleteById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        
        const deletedLouver = await Louver.findByIdAndDelete(id); // Find and delete the Louver
        //console.log(deletedDoor);
        // Check if the Louver was found
        if (!deletedLouver) {
            return res.status(404).json({ message: 'Louver not found' });
        }

        res.status(200).json({ message: 'Louver deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting Louver', error });
    }
});

module.exports = router;

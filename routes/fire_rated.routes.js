const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const FireRated = require('../models/fire_rated.model'); 
const router = express.Router();


// Get Fire Rated by ID
router.get('/getById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        const fireRate = await FireRated.findById(id); 

        // Check if the company was found
        if (!fireRate) {
            return res.status(404).json({ message: 'Fire Rated not found' });
        }

        res.status(200).json({ fireRate });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Fire Rated', error });
    }
});

// Get By material
router.get('/getByMaterial/:material', async (req, res) => {
    const { material } = req.params; 
    try {
        const fireRate = await FireRated.find({ material: material }); 

        // Check if the Data Category was found
        if (!fireRate) {
            return res.status(404).json({ message: 'Fire Rated not found' });
        }

        res.status(200).json({ fireRate });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Fire Rated', error });
    }
});

// Get All
router.get('/getAll/', async (req, res) => {
    try {
        const fireRate = await FireRated.find().sort({ _id: 1 });;
        //console.log(fireRate);
        // Check if the Fire Rated was found
        if (!fireRate) {
            return res.status(404).json({ message: 'Fire rated not found' });
        }

        res.status(200).json({ fireRate });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Fire Rated', error });
    }
});

// Create Fire rated
router.post('/create_fire_rated', async (req, res) => {
    const { title, description, fire_rated_image, fire_rated_score, material } = req.body;
    try {
        let fireRate
        const checkProduct = await FireRated.find({ title: title });
        //console.log(checkProduct);
        fireRate = new FireRated({ title, description, fire_rated_image, fire_rated_score, material });
        await fireRate.save();

        res.status(200).json({ message: 'Fire Rated created successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error creating Fire Rated', error });
    }
}); 


router.put('/update_fire_rated/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters
    const { title, description, fire_rated_image, fire_rated_score, material, status } = req.body;

    try {
        const fireRate = await FireRated.findByIdAndUpdate(
            id,
            { title, description, fire_rated_image, fire_rated_score, material, status, updatedAt: Date.now() },
            { new: true, runValidators: true } // Return the updated document and validate
        );
        // Check if the Fire Rated was found
        if (!fireRate) {
            return res.status(404).json({ message: 'Fire Rated not found' });
        }
        
        res.status(200).json({ message: 'Fire Rated updated successfully'});
    } catch (error) {
        res.status(400).json({ message: 'Error updating Fire Rated', error });
    }
});

// Delete fire rated by ID
router.delete('/deleteById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        
        const deletedFireRated = await FireRated.findByIdAndDelete(id); // Find and delete the fire rated
        //console.log(deletedDoor);
        // Check if the fire rated was found
        if (!deletedFireRated) {
            return res.status(404).json({ message: 'Fire Rated not found' });
        }

        res.status(200).json({ message: 'Fire Rated deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting Fire Rated', error });
    }
});

module.exports = router;

const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const GlassType = require('../models/glass_type.model'); 
const router = express.Router();


// Get Glass Type by ID
router.get('/getById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        const products = await GlassType.findById(id); 

        // Check if the Glass type was found
        if (!products) {
            return res.status(404).json({ message: 'Glass type not found' });
        }

        res.status(200).json({ products });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Glass type', error });
    }
});

// Get By material
router.get('/getByProductId/:quot_prod_id', async (req, res) => {
    const { lite_kit_id } = req.params; 
    try {
        const data = await GlassType.find({ lite_kit_id: lite_kit_id }); 

        // Check if the Data Category was found
        if (!data) {
            return res.status(404).json({ message: 'Glass type not found' });
        }

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Glass type', error });
    }
});

// Get All
router.get('/getAll/', async (req, res) => {
    try {
        const products = await GlassType.find();

        // Check if the company was found
        if (!products) {
            return res.status(404).json({ message: 'Glass type not found' });
        }

        res.status(200).json({ products });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Glass type', error });
    }
});

// Create door heights
router.post('/create_glass_type', async (req, res) => {
    const { quot_prod_id, title, description, product_image, price, status } = req.body;
    try {
        let data
        const checkProduct = await GlassType.find({ title: title });
        //console.log(checkProduct);
        data = new GlassType({ quot_prod_id, title, description, product_image, price, status });
        await data.save();

        res.status(200).json({ message: 'Glass type created successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error creating Glass type', error });
    }
}); 


router.put('/update_glass_type/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters
    const { title, description, product_image, price, status } = req.body;

    try {
        const Products = await GlassType.findByIdAndUpdate(
            id,
            { title, description, product_image, price, status, updatedAt: Date.now() },
            { new: true, runValidators: true } // Return the updated document and validate
        );
        // Check if the glass type was found
        if (!Products) {
            return res.status(404).json({ message: 'Glass type not found' });
        }
        
        res.status(200).json({ message: 'Glass type updated successfully'});
    } catch (error) {
        res.status(400).json({ message: 'Error updating Glass type', error });
    }
});

// Delete glass type by ID
router.delete('/deleteById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        
        const deletedProduct = await GlassType.findByIdAndDelete(id); // Find and delete the company
        //console.log(deletedDoor);
        // Check if the company was found
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Glass type not found' });
        }

        res.status(200).json({ message: 'Glass type deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting Glass type', error });
    }
});

module.exports = router;

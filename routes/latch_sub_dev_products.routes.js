const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const LatchDevProduct = require('../models/latch_sub_dev_products.model'); 
const LatchDevice = require('../models/latch_sub_device.model'); 
const router = express.Router();


// Get Latch Sub Product by ID
router.get('/getById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        const data = await LatchDevProduct.findById(id); 

        // Check if the company was found
        if (!data) {
            return res.status(404).json({ message: 'Latch Sub Product not found' });
        }

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Latch Sub Product', error });
    }
});

router.get('/getBySubCDevice/:catId', async (req, res) => {
    try {
        const { catId } = req.params;

        // Fetch records where applied_on is the requested material or 'Both'
        const latch_products = await LatchDevProduct.find({ latch_sub_device_id: catId });

        res.status(200).json({ latch_products });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Latch Sub Product', error });
    }
});

// Get All
router.get('/getAll/', async (req, res) => {
    try {
        const data = await LatchDevProduct.find();
        //console.log(fireRate);
        // Check if the Latch Sub Product was found
        if (!data) {
            return res.status(404).json({ message: 'Latch Sub Product not found' });
        }

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Latch Sub Product', error });
    }
});

// Create Latch Sub Product
router.post('/create_latch_sub_product', async (req, res) => {
    const { latch_sub_device_id, title, description, latch_image, latch_rate } = req.body;
    //console.log("Request Body",req.body);
    try {
        // Ensure latch_category_id is always an array
        //const latchCategoryArray = Array.isArray(latch_category_id) ? latch_category_id : [latch_category_id];

        // Check if a product with the same title exists
        const checkProduct = await LatchDevProduct.findOne({ title });
        //console.log(checkProduct);
        if (checkProduct) {
            return res.status(400).json({ message: 'Latch Sub Product with this title already exists' });
        }
        const newProduct = new LatchDevProduct({
            latch_sub_device_id: latch_sub_device_id,
            title,
            description,
            latch_image,
            latch_rate
        });
        await newProduct.save();

        res.status(200).json({ message: 'Latch Sub Product created successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error creating Latch Sub Product', error });
    }
}); 


router.put('/update_latch_sub_product/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters
    const { title, description, latch_image, latch_rate, status } = req.body;

    try {

        // Ensure latch_category_id is an array
        //const latchCategoryArray = Array.isArray(latch_category_id) ? latch_category_id : [latch_category_id];

        const data = await LatchDevProduct.findByIdAndUpdate(
            id,
            { title, description, latch_image, latch_rate, status, updatedAt: Date.now() },
            { new: true, runValidators: true } // Return the updated document and validate
        );
        // Check if the Latch Sub Product was found
        if (!data) {
            return res.status(404).json({ message: 'Latch Sub Product not found' });
        }
        
        res.status(200).json({ message: 'Latch Sub Product updated successfully'});
    } catch (error) {
        res.status(400).json({ message: 'Error updating Latch Sub Product', error });
    }
});

// Delete Latch Sub Product by ID
router.delete('/deleteById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        
        const deletedLatchDevProduct = await LatchDevProduct.findByIdAndDelete(id); // Find and delete the fire rated
        //console.log(deletedDoor);
        // Check if the fire rated was found
        if (!deletedLatchDevProduct) {
            return res.status(404).json({ message: 'Latch Sub Product not found' });
        }

        res.status(200).json({ message: 'Latch Sub Product deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting Latch Sub Product', error });
    }
});

module.exports = router;

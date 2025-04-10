const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const LatchProduct = require('../models/latch_products.model'); 
const LatchCategory = require('../models/latch_category.model'); 
const router = express.Router();


// Get Latch Product by ID
router.get('/getById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        const data = await LatchProduct.findById(id); 

        // Check if the company was found
        if (!data) {
            return res.status(404).json({ message: 'Latch Product not found' });
        }

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Latch Product', error });
    }
});

router.get('/getBySubCategory/:catId', async (req, res) => {
    try {
        const { catId } = req.params;

        // Fetch records where applied_on is the requested material or 'Both'
        const latch_products = await LatchProduct.find({ latch_sub_category_id: catId });

        res.status(200).json({ latch_products });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Latch Product', error });
    }
});

// Get All
router.get('/getAll/', async (req, res) => {
    try {
        const data = await LatchProduct.find();
        //console.log(fireRate);
        // Check if the Latch Product was found
        if (!data) {
            return res.status(404).json({ message: 'Latch Product not found' });
        }

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Latch Product', error });
    }
});

// Create Latch Product
router.post('/create_latch_product', async (req, res) => {
    const { latch_sub_category_id, title, description, latch_image, latch_rate } = req.body;
    //console.log("Request Body",req.body);
    try {
        // Ensure latch_category_id is always an array
        //const latchCategoryArray = Array.isArray(latch_category_id) ? latch_category_id : [latch_category_id];

        // Check if a product with the same title exists
        const checkProduct = await LatchProduct.findOne({ latch_sub_category_id, title });
        //console.log(checkProduct);
        if (checkProduct) {
            return res.status(400).json({ message: 'Latch Product with this title already exists' });
        }
        const newProduct = new LatchProduct({
            latch_sub_category_id: latch_sub_category_id,
            title,
            description,
            latch_image,
            latch_rate
        });
        await newProduct.save();

        res.status(200).json({ message: 'Latch Product created successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error creating Latch Product', error });
    }
}); 


router.put('/update_latch_product/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters
    const { title, description, latch_image, latch_rate, status } = req.body;

    try {

        // Ensure latch_category_id is an array
        //const latchCategoryArray = Array.isArray(latch_category_id) ? latch_category_id : [latch_category_id];

        const data = await LatchProduct.findByIdAndUpdate(
            id,
            { title, description, latch_image, latch_rate, status, updatedAt: Date.now() },
            { new: true, runValidators: true } // Return the updated document and validate
        );
        // Check if the Latch Product was found
        if (!data) {
            return res.status(404).json({ message: 'Latch Product not found' });
        }
        
        res.status(200).json({ message: 'Latch Product updated successfully'});
    } catch (error) {
        res.status(400).json({ message: 'Error updating Latch Product', error });
    }
});

// Delete Latch Product by ID
router.delete('/deleteById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        
        const deletedLatchProduct = await LatchProduct.findByIdAndDelete(id); // Find and delete the fire rated
        //console.log(deletedDoor);
        // Check if the fire rated was found
        if (!deletedLatchProduct) {
            return res.status(404).json({ message: 'Latch Product not found' });
        }

        res.status(200).json({ message: 'Latch Product deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting Latch Product', error });
    }
});

module.exports = router;

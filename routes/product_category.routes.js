const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ProductCategory = require('../models/product_category.model'); 
const router = express.Router();


// Get Company by ID
router.get('/getById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        const data = await ProductCategory.findById(id); 

        // Check if the Product Category was found
        if (!data) {
            return res.status(404).json({ message: 'Product Category not found' });
        }

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Product Category', error });
    }
});

// Get By material
router.get('/getByQuotId/:quot_prod_id', async (req, res) => {
    const { type } = req.params; 
    try {
        const data = await ProductCategory.find({ type: type }); 

        // Check if the Product Category was found
        if (!data) {
            return res.status(404).json({ message: 'Product Category not found' });
        }

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Product Category', error });
    }
});

// Get All
router.get('/getAll/', async (req, res) => {
    try {
        const data = await ProductCategory.find();

        // Check if the Product Category was found
        if (!data) {
            return res.status(404).json({ message: 'Product Category not found' });
        }

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Door Category', error });
    }
});

// Create door heights
router.post('/create_product_category', async (req, res) => {
    const { quot_prod_id, title, description, door_image, material, type } = req.body;
    try {
        let data
        const checkProduct = await ProductCategory.find({ title: title });
        //console.log(checkProduct);
        data = new ProductCategory({ quot_prod_id, title, description, door_image, material, type });
        await data.save();

        res.status(200).json({ message: 'Product Category created successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error creating Product Category', error });
    }
}); 


router.put('/update_product_category/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters
    const { title, description, door_image, material, type, status } = req.body;

    try {
        const data = await ProductCategory.findByIdAndUpdate(
            id,
            { title, description, door_image, material, type, status, updatedAt: Date.now() },
            { new: true, runValidators: true } // Return the updated document and validate
        );
        // Check if the company rate was found
        if (!data) {
            return res.status(404).json({ message: 'Product Category not found' });
        }
        
        res.status(200).json({ message: 'Product Category updated successfully'});
    } catch (error) {
        res.status(400).json({ message: 'Error updating Product Category', error });
    }
});

// Delete Product Category by ID
router.delete('/deleteById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        
        const deletedProduct = await ProductCategory.findByIdAndDelete(id); // Find and delete the Product Category
        //console.log(deletedDoor);
        // Check if the company was found
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product Category not found' });
        }

        res.status(200).json({ message: 'Product Category deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting Product Category', error });
    }
});

module.exports = router;

const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const MiscCategory = require('../models/misc_categories.model'); 
const MiscProduct = require('../models/misc_products.model'); 
const router = express.Router();


// Get Misc Category by ID
router.get('/getById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        const data = await MiscCategory.findById(id); 

        // Check if the Misc Category was found
        if (!data) {
            return res.status(404).json({ message: 'Misc Category not found' });
        }

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Misc Category', error });
    }
});

// Get By product id
router.get('/getByProductId/:quot_prod_id/', async (req, res) => {
    const { quot_prod_id } = req.params; 
    try {
        const data = await MiscCategory.find({  quot_prod_id: quot_prod_id, status: 'Active' }); 

        // Check if the Door Hand was found
        if (!data) {
            return res.status(404).json({ message: 'Misc Category not found' });
        }

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Misc Category', error });
    }
});

// Get All
router.get('/getAll/', async (req, res) => {
    try {
        const data = await MiscCategory.find();
        // Check if the Misc Category was found
        if (!data) {
            return res.status(404).json({ message: 'Misc Category not found' });
        }

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Misc Category', error });
    }
});

// Create Misc Category
router.post('/create_misc_category', async (req, res) => {
    const { quot_prod_id,title, description, misc_image } = req.body;
    try {
        let data
        const checkProduct = await MiscCategory.find({ title: title });
        //console.log(checkProduct);
        data = new MiscCategory({ quot_prod_id, title, description, misc_image });
        //console.log(data);
        await data.save();

        res.status(200).json({ message: 'Misc Category created successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error creating Misc Category', error });
    }
}); 


router.put('/update_misc_category/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters
    const { title, description, misc_image, status } = req.body;

    try {
        const data = await MiscCategory.findByIdAndUpdate(
            id,
            { title, description, misc_image, status, updatedAt: Date.now() },
            { new: true, runValidators: true } // Return the updated document and validate
        );
        // Check if the Misc Category was found
        if (!data) {
            return res.status(404).json({ message: 'Misc Category not found' });
        }
        
        res.status(200).json({ message: 'Misc Category updated successfully'});
    } catch (error) {
        res.status(400).json({ message: 'Error updating Misc Category', error });
    }
});

// Delete Misc Category by ID
router.delete('/deleteById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        const deletedMiscProduct = await MiscProduct.deleteMany({ misc_category_id: id });
        //console.log((deletedHardwareProduct).deletedCount);
        if (!deletedMiscProduct) {
            //return res.status(404).json({ message: 'User Journey Detail not found' });
        }

        const deletedMiscCategory = await MiscCategory.findByIdAndDelete(id); // Find and delete the Misc Category
        //console.log(deletedDoor);
        // Check if the Misc Category was found
        if (!deletedMiscCategory) {
            return res.status(404).json({ message: 'Misc Category not found' });
        }

        res.status(200).json({ message: 'Misc Category deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting Misc Category', error });
    }
});

module.exports = router;

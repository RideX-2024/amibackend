const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const HardwareProduct = require('../models/harware_products.model'); 
const HardwareCategory = require('../models/hardware_category.model'); 
const router = express.Router();


// Get Hardware Category by ID
router.get('/getById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        const data = await HardwareCategory.findById(id); 

        // Check if the Hardware Category was found
        if (!data) {
            return res.status(404).json({ message: 'Hardware Category not found' });
        }

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Hardware Category', error });
    }
});

// Get All
router.get('/getAll/', async (req, res) => {
    try {
        const data = await HardwareCategory.find();
        // Check if the Hardware Category was found
        if (!data) {
            return res.status(404).json({ message: 'Hardware Category not found' });
        }

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Hardware Category', error });
    }
});

// Create Hardware Category
router.post('/create_hardware_category', async (req, res) => {
    const { title, description, hardware_image } = req.body;
    //console.log(req.body);
    try {
        let data
        const checkProduct = await HardwareCategory.find({ title: title });
        //console.log(checkProduct);
        data = new HardwareCategory({ title, description, hardware_image });
        //console.log(data);
        await data.save();

        res.status(200).json({ message: 'Hardware Category created successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error creating Hardware Category', error });
    }
}); 


router.put('/update_hardware_category/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters
    const { title, description, hardware_image, status } = req.body;

    try {
        const data = await HardwareCategory.findByIdAndUpdate(
            id,
            { title, description, hardware_image, status, updatedAt: Date.now() },
            { new: true, runValidators: true } // Return the updated document and validate
        );
        // Check if the Hardware Category was found
        if (!data) {
            return res.status(404).json({ message: 'Hardware Category not found' });
        }
        
        res.status(200).json({ message: 'Hardware Category updated successfully'});
    } catch (error) {
        res.status(400).json({ message: 'Error updating Hardware Category', error });
    }
});

// Delete Hardware Category by ID
router.delete('/deleteById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        const deletedHardwareProduct = await HardwareProduct.deleteMany({ hardware_category_id: id });
        //console.log((deletedHardwareProduct).deletedCount);
        if (!deletedHardwareProduct) {
            //return res.status(404).json({ message: 'User Journey Detail not found' });
        }        
        
        const deletedHardwareCategory = await HardwareCategory.findByIdAndDelete(id); // Find and delete the Hardware Category
        //console.log(deletedDoor);
        // Check if the Hardware Category was found
        if (!deletedHardwareCategory) {
            return res.status(404).json({ message: 'Hardware Category not found' });
        }

        res.status(200).json({ message: 'Hardware Category deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting Hardware Category', error });
    }
});

module.exports = router;

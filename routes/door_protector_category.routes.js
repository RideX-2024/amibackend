const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const doorProtectProduct = require('../models/door_protector_product.model'); 
const doorProtectCategory = require('../models/door_protector_category.model'); 
const router = express.Router();


// Get Door Protector Category by ID
router.get('/getById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        const data = await doorProtectCategory.findById(id); 

        // Check if the Door Protector Category was found
        if (!data) {
            return res.status(404).json({ message: 'Door Protector Category not found' });
        }

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Door Protector Category', error });
    }
});
/*
router.get('/getByCategory/:catId', async (req, res) => {
    try {
        const { catId } = req.params;
        console.log(req.params);
        // Fetch records where applied_on is the requested material or 'Both'
        const data = await doorProtectCategory.find({ latch_category_id: catId });

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Latch Product', error });
    }
});
*/
// Get All
router.get('/getAll/', async (req, res) => {
    try {
        const data = await doorProtectCategory.find();
        //console.log(fireRate);
        // Check if the Door Protector Category was found
        if (!data) {
            return res.status(404).json({ message: 'Door Protector Category not found' });
        }

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Door Protector Category', error });
    }
});

// Create Door Protector Category
router.post('/create_door_protect_category', async (req, res) => {
    const { title, description } = req.body;
    try {
        // Check if a Sub category with the same title exists
        const checkProduct = await doorProtectCategory.findOne({ title });
        //console.log(checkProduct);
        if (checkProduct) {
            return res.status(400).json({ message: 'Door Protector Category with this title already exists' });
        }
        const newSubCat = new doorProtectCategory({
            title,
            description
        });
        await newSubCat.save();

        res.status(200).json({ message: 'Door Protector Category created successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error creating Door Protector Category', error });
    }
}); 


router.put('/update_door_protect_category/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters
    const { title, description, status } = req.body;

    try {

        const data = await doorProtectCategory.findByIdAndUpdate(
            id,
            { title, description, status, updatedAt: Date.now() },
            { new: true, runValidators: true } // Return the updated document and validate
        );
        // Check if the Door Protector Category was found
        if (!data) {
            return res.status(404).json({ message: 'Door Protector Category not found' });
        }
        
        res.status(200).json({ message: 'Door Protector Category updated successfully'});
    } catch (error) {
        res.status(400).json({ message: 'Error updating Door Protector Category', error });
    }
});

// Delete Door Protector Category by ID
router.delete('/deleteById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters
    console.log(id);
    try {
        const deleteddoorProtectproduct = await doorProtectProduct.deleteMany({ door_protector_category_id: id });
        console.log((deleteddoorProtectproduct).deletedCount);
        if (!deleteddoorProtectproduct) {
            //return res.status(404).json({ message: 'User Journey Detail not found' });
        }        

        const deleteddoorProtectCategory = await doorProtectCategory.findByIdAndDelete(id); // Find and delete the Door Protector Category
        //console.log(deletedDoor);
        // Check if the Door Protector Category was found
        if (!deleteddoorProtectCategory) {
            return res.status(404).json({ message: 'Door Protector Category not found' });
        }

        res.status(200).json({ message: 'Door Protector Category deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting Door Protector Category', error });
    }
});

module.exports = router;

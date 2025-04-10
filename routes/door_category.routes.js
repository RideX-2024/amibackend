const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const DoorCategory = require('../models/door_category.model'); 
const router = express.Router();


// Get Company by ID
router.get('/getById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        const Products = await DoorCategory.findById(id); 

        // Check if the company was found
        if (!Products) {
            return res.status(404).json({ message: 'Door Category not found' });
        }

        res.status(200).json({ Products });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Door Category', error });
    }
});

// Get By material
router.get('/getByType/:type/:quot_prod_id', async (req, res) => {
    const { type, quot_prod_id } = req.params; 
    try {
        const data = await DoorCategory.find({ type: type, quot_prod_id: quot_prod_id }); 

        // Check if the Data Category was found
        if (!data) {
            return res.status(404).json({ message: 'Door Category not found' });
        }

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Data Category', error });
    }
});

// Get All
router.get('/getAllByCate/', async (req, res) => {
    try {
        const products = await DoorCategory.find({ type: "category" });

        // Check if the company was found
        if (!products) {
            return res.status(404).json({ message: 'Door Category not found' });
        }

        res.status(200).json({ products });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Door Category', error });
    }
});

// Get All
router.get('/getAllByType/', async (req, res) => {
    try {
        const products = await DoorCategory.find({ type: "type" });

        // Check if the company was found
        if (!products) {
            return res.status(404).json({ message: 'Door Category not found' });
        }

        res.status(200).json({ products });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Door Category', error });
    }
});

// Get All
router.get('/getAllByFrame/', async (req, res) => {
    try {
        const products = await DoorCategory.find({ type: "frame" });

        // Check if the company was found
        if (!products) {
            return res.status(404).json({ message: 'Door Category not found' });
        }

        res.status(200).json({ products });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Door Category', error });
    }
});

// Get All
router.get('/getAll/', async (req, res) => {
    try {
        const products = await DoorCategory.find().sort({_id: -1});

        // Check if the company was found
        if (!products) {
            return res.status(404).json({ message: 'Door Category not found' });
        }

        res.status(200).json({ products });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Door Category', error });
    }
});

// Create door heights
router.post('/create_door_category', async (req, res) => {
    const { quot_prod_id, title, description, door_image, material, type } = req.body;
    try {
        let doorCategory
        const checkProduct = await DoorCategory.find({ title: title });
        //console.log(checkProduct);
        doorCategory = new DoorCategory({ quot_prod_id, title, description, door_image, material, type });
        await doorCategory.save();

        res.status(200).json({ message: 'Door Category created successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error creating Door Category', error });
    }
}); 


router.put('/update_door_category/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters
    const { title, description, door_image, material, type, status } = req.body;

    try {
        const Products = await DoorCategory.findByIdAndUpdate(
            id,
            { title, description, door_image, material, type, status, updatedAt: Date.now() },
            { new: true, runValidators: true } // Return the updated document and validate
        );
        // Check if the company rate was found
        if (!Products) {
            return res.status(404).json({ message: 'Door Category not found' });
        }
        
        res.status(200).json({ message: 'Door Category updated successfully'});
    } catch (error) {
        res.status(400).json({ message: 'Error updating Door Category', error });
    }
});

// Delete door height by ID
router.delete('/deleteById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        
        const deletedProduct = await DoorCategory.findByIdAndDelete(id); // Find and delete the company
        //console.log(deletedDoor);
        // Check if the company was found
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Door Category not found' });
        }

        res.status(200).json({ message: 'Door Category deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting Door Category', error });
    }
});

module.exports = router;

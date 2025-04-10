const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const HardwareProduct = require('../models/harware_products.model'); 
const HardwareCategory = require('../models/hardware_category.model'); 
const router = express.Router();


// Get Hardware Product by ID
router.get('/getById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        const data = await HardwareProduct.findById(id); 

        // Check if the Hardware Product was found
        if (!data) {
            return res.status(404).json({ message: 'Hardware Product not found' });
        }

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Hardware Product', error });
    }
});


router.get('/hardware_data', async (req, res) => {
    try {
        const data = await HardwareCategory.aggregate([
            {
                $lookup: {
                    from: 'hardware_products', // Collection name in MongoDB
                    localField: '_id',
                    foreignField: 'hardware_category_id',
                    as: 'hardwareProducts'
                }
            },
            {
                $sort: { createdAt: -1 } // Sort categories by createdAt descending
            }
        ]);
        //console.log(data);

        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error fetching hardware data:', error);
        res.status(500).json({ success: false, message: 'Server error', error });
    }
});

router.get('/getByCategory/:catId', async (req, res) => {
    try {
        const { catId } = req.params;

        // Fetch records where applied_on is the requested material or 'Both'
        const data = await HardwareProduct.find({ hardware_category_id: catId });

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Hardware Product', error });
    }
});

// Get All
router.get('/getAll/', async (req, res) => {
    try {
        const data = await HardwareProduct.find();
        //console.log(fireRate);
        // Check if the Hardware Product was found
        if (!data) {
            return res.status(404).json({ message: 'Hardware Product not found' });
        }

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Hardware Product', error });
    }
});

// Create Hardware Product
router.post('/create_hardware_product', async (req, res) => {
    const { hardware_category_id, title, description, product_image, price } = req.body;
    try {
        // Check if a product with the same title exists
        const checkProduct = await HardwareProduct.findOne({ title });
        if (checkProduct) {
            return res.status(400).json({ message: 'Hardware Product with this title already exists' });
        }
        const newProduct = new HardwareProduct({
            hardware_category_id: hardware_category_id,
            title,
            description,
            product_image,
            price
        });
        await newProduct.save();

        res.status(200).json({ message: 'Hardware Product created successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error creating Hardware Product', error });
    }
}); 


router.put('/update_hardware_product/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters
    const { title, description, product_image, price, status } = req.body;

    try {
        const data = await HardwareProduct.findByIdAndUpdate(
            id,
            { title, description, product_image, price, status, updatedAt: Date.now() },
            { new: true, runValidators: true } // Return the updated document and validate
        );
        // Check if the Hardware Product was found
        if (!data) {
            return res.status(404).json({ message: 'Hardware Product not found' });
        }
        
        res.status(200).json({ message: 'Hardware Product updated successfully'});
    } catch (error) {
        res.status(400).json({ message: 'Error updating Hardware Product', error });
    }
});

// Delete Hardware Product by ID
router.delete('/deleteById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        
        const deletedHardwareProduct = await HardwareProduct.findByIdAndDelete(id); // Find and delete the fire rated
        //console.log(deletedDoor);
        // Check if the fire rated was found
        if (!deletedHardwareProduct) {
            return res.status(404).json({ message: 'Hardware Product not found' });
        }

        res.status(200).json({ message: 'Hardware Product deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting Hardware Product', error });
    }
});

module.exports = router;

const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const MiscProduct = require('../models/misc_products.model'); 
const MiscCategory = require('../models/misc_categories.model'); 
const router = express.Router();


// Get Misc Product by ID
router.get('/getById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        const data = await MiscProduct.findById(id); 

        // Check if the Misc Product was found
        if (!data) {
            return res.status(404).json({ message: 'Misc Product not found' });
        }

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Misc Product', error });
    }
});


router.get('/misc_data', async (req, res) => {
    try {
        const { quot_prod_id } = req.query; // Get quot_prod_id from query parameters
        console.log("Query Parameter");
        console.log("Query Parameter", req.query);
        // Validate and convert quot_prod_id to ObjectId if provided
        const matchStage = quot_prod_id
            ? { $match: { quot_prod_id: new ObjectId(quot_prod_id) } }
            : {};

        const pipeline = [
            matchStage, // Apply filtering if quot_prod_id is provided
            {
                $lookup: {
                    from: 'misc_products', // Collection name in MongoDB
                    localField: '_id',
                    foreignField: 'misc_category_id',
                    as: 'MiscProducts'
                }
            },
            {
                $sort: { createdAt: -1 } // Sort categories by createdAt descending
            }
        ].filter(stage => Object.keys(stage).length > 0); // Remove empty objects
        console.log(pipeline);
        const data = await MiscCategory.aggregate(pipeline);
        console.log(data);
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error fetching misc data:', error);
        res.status(500).json({ success: false, message: 'Server error', error });
    }
});


/*router.get('/misc_data', async (req, res) => {
    try {
        const data = await MiscCategory.aggregate([
            {
                $lookup: {
                    from: 'misc_products', // Collection name in MongoDB
                    localField: '_id',
                    foreignField: 'misc_category_id',
                    as: 'MiscProducts'
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
});*/

router.get('/getByCategory/:catId', async (req, res) => {
    try {
        const { catId } = req.params;

        // Fetch records where applied_on is the requested material or 'Both'
        const data = await MiscProduct.find({ misc_category_id: catId });

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Misc Product', error });
    }
});

// Get All
router.get('/getAll/', async (req, res) => {
    try {
        const data = await MiscProduct.find();
        //console.log(fireRate);
        // Check if the Misc Product was found
        if (!data) {
            return res.status(404).json({ message: 'Misc Product not found' });
        }

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Misc Product', error });
    }
});

// Create Misc Product
router.post('/create_misc_product', async (req, res) => {
    const { misc_category_id, title, description, product_image, product_rate } = req.body;
    try {
        // Check if a product with the same title exists
        const checkProduct = await MiscProduct.findOne({ title });
        if (checkProduct) {
            return res.status(400).json({ message: 'Misc Product with this title already exists' });
        }
        const newProduct = new MiscProduct({
            misc_category_id: misc_category_id,
            title,
            description,
            product_image,
            product_rate
        });
        await newProduct.save();

        res.status(200).json({ message: 'Misc Product created successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error creating Misc Product', error });
    }
}); 


router.put('/update_misc_product/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters
    const { title, description, product_image, product_rate, status } = req.body;

    try {
        const data = await MiscProduct.findByIdAndUpdate(
            id,
            { title, description, product_image, product_rate, status, updatedAt: Date.now() },
            { new: true, runValidators: true } // Return the updated document and validate
        );
        // Check if the Misc Product was found
        if (!data) {
            return res.status(404).json({ message: 'Misc Product not found' });
        }
        
        res.status(200).json({ message: 'Misc Product updated successfully'});
    } catch (error) {
        res.status(400).json({ message: 'Error updating Misc Product', error });
    }
});

// Delete Misc Product by ID
router.delete('/deleteById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        
        const deletedMiscProduct = await MiscProduct.findByIdAndDelete(id); // Find and delete the fire rated
        //console.log(deletedDoor);
        // Check if the fire rated was found
        if (!deletedMiscProduct) {
            return res.status(404).json({ message: 'Misc Product not found' });
        }

        res.status(200).json({ message: 'Misc Product deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting Misc Product', error });
    }
});

module.exports = router;

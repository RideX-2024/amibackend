const express = require('express');
const { ObjectId } = require('mongodb');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const LatchCategory = require('../models/latch_category.model'); 
const LatchSubCategory = require('../models/latch_sub_category.model'); 
const LatchProduct = require('../models/latch_products.model'); 
const router = express.Router();


// Get Latch Sub category by ID
router.get('/getById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        const data = await LatchSubCategory.findById(id); 

        // Check if the Latch Sub category was found
        if (!data) {
            return res.status(404).json({ message: 'Latch Sub category not found' });
        }

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Latch Sub category', error });
    }
});

router.get('/getByCategory/:catId', async (req, res) => {
    try {
        const { catId } = req.params;
        //console.log(req.params);
        // Fetch records where applied_on is the requested material or 'Both'
        const data = await LatchSubCategory.find({ latch_category_id: catId });

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Latch Product', error });
    }
});


//get all sub categories and products of that category
router.get('/latch_products/:categoryId', async (req, res) => {
    try {
        const { categoryId } = req.params;

        const data = await LatchSubCategory.aggregate([
            {
                $match: {
                    //latch_category_id: new mongoose.Types.ObjectId(categoryId)
                    latch_category_id: new ObjectId(categoryId)
                }
            },
            {
                $lookup: {
                    from: 'latch_products', // MongoDB collection name
                    localField: '_id',
                    foreignField: 'latch_sub_category_id',
                    as: 'products'
                }
            },
            {
                $sort: { createdAt: -1 } // Sort by newest subcategories first
            }
        ]);

        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error fetching latch data:', error);
        res.status(500).json({ success: false, message: 'Server error', error });
    }
});


// Get All
router.get('/getAll/', async (req, res) => {
    try {
        const data = await LatchSubCategory.find();
        //console.log(fireRate);
        // Check if the Latch Sub category was found
        if (!data) {
            return res.status(404).json({ message: 'Latch Sub category not found' });
        }

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Latch Sub category', error });
    }
});

// Create Latch Sub category
router.post('/create_latch_sub_category', async (req, res) => {
    const { latch_category_id, title, description } = req.body;
    try {
        // Ensure latch_category_id is always an array
        const latchCategoryArray = Array.isArray(latch_category_id) ? latch_category_id : [latch_category_id];

        // Check if a Sub category with the same title exists
        const checkProduct = await LatchSubCategory.findOne({ title });
        //console.log(checkProduct);        
        if (checkProduct) {

            const isDuplicate = latchCategoryArray.every(categoryId =>
                checkProduct.latch_category_id.includes(categoryId)
            );
            //console.log(isDuplicate);
            if (isDuplicate) {
                //console.log(`Subcategory with title "${title}" and selected categories already exists.`);
                return res.status(404).json(`Subcategory with title "${title}" and selected categories already exists.`);
            }
        }
        const newSubCat = new LatchSubCategory({
            latch_category_id: latchCategoryArray,
            title,
            description
        });
        await newSubCat.save();

        res.status(200).json({ message: 'Latch Sub category created successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error creating Latch Sub category', error });
    }
}); 


router.put('/update_latch_sub_catgory/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters
    const { latch_category_id, title, description, status } = req.body;

    try {

        // Ensure latch_category_id is an array
        const latchCategoryArray = Array.isArray(latch_category_id) ? latch_category_id : [latch_category_id];

        const data = await LatchSubCategory.findByIdAndUpdate(
            id,
            { title, description, status, updatedAt: Date.now() },
            { new: true, runValidators: true } // Return the updated document and validate
        );
        // Check if the Latch Sub category was found
        if (!data) {
            return res.status(404).json({ message: 'Latch Sub category not found' });
        }
        
        res.status(200).json({ message: 'Latch Sub category updated successfully'});
    } catch (error) {
        res.status(400).json({ message: 'Error updating Latch Sub category', error });
    }
});

// Delete Latch Sub category by ID
router.delete('/deleteById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        const deletedLatchSubProduct = await LatchProduct.deleteMany({ latch_sub_category_id: id });
        //console.log((deletedHardwareProduct).deletedCount);
        if (!deletedLatchSubProduct) {
            //return res.status(404).json({ message: 'User Journey Detail not found' });
        }        
                
        const deletedLatchSubCategory = await LatchSubCategory.findByIdAndDelete(id); // Find and delete the Latch Sub category
        //console.log(deletedDoor);
        // Check if the Latch Sub category was found
        if (!deletedLatchSubCategory) {
            return res.status(404).json({ message: 'Latch Sub category not found' });
        }

        res.status(200).json({ message: 'Latch Sub category deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting Latch Sub category', error });
    }
});

module.exports = router;

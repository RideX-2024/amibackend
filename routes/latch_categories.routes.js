const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const LatchCategory = require('../models/latch_category.model'); 
const router = express.Router();


// Get Fire Rated by ID
router.get('/getById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        const data = await LatchCategory.findById(id); 

        // Check if the company was found
        if (!data) {
            return res.status(404).json({ message: 'Latch Category not found' });
        }

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Latch Category', error });
    }
});

router.get('/getByMaterial/:material', async (req, res) => {
    try {
        const { material } = req.params;

        if (!['Wood', 'Metal','Building'].includes(material)) {
            return res.status(400).json({ message: 'Invalid material type. Use "Wood" or "Metal".' });
        }

        // Fetch records where applied_on is the requested material or 'Both'
        const data = await LatchCategory.find({
            applied_on: { $in: [material, 'Both'] }
        });

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Latch Categories', error });
    }
});

// Get All
router.get('/getAll/', async (req, res) => {
    try {
        const data = await LatchCategory.find();
        //console.log(fireRate);
        // Check if the Latch Category was found
        if (!data) {
            return res.status(404).json({ message: 'Latch Category not found' });
        }

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Latch Category', error });
    }
});

// Create Fire rated
router.post('/create_latch_category', async (req, res) => {
    const { title, description, latch_image, applied_on } = req.body;
    try {
        let data
        const checkProduct = await LatchCategory.find({ title: title });
        //console.log(checkProduct);
        data = new LatchCategory({ title, description, latch_image, applied_on });
        await data.save();

        res.status(200).json({ message: 'Latch Category created successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error creating Latch Category', error });
    }
}); 


router.put('/update_latch_category/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters
    const { title, description, latch_image, applied_on, status } = req.body;

    try {
        const data = await LatchCategory.findByIdAndUpdate(
            id,
            { title, description, latch_image, applied_on, status, updatedAt: Date.now() },
            { new: true, runValidators: true } // Return the updated document and validate
        );
        // Check if the Latch Category was found
        if (!data) {
            return res.status(404).json({ message: 'Latch Category not found' });
        }
        
        res.status(200).json({ message: 'Latch Category updated successfully'});
    } catch (error) {
        res.status(400).json({ message: 'Error updating Latch Category', error });
    }
});

// Delete Latch Category by ID
router.delete('/deleteById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        
        const deletedLatchCategory = await LatchCategory.findByIdAndDelete(id); // Find and delete the fire rated
        //console.log(deletedDoor);
        // Check if the fire rated was found
        if (!deletedLatchCategory) {
            return res.status(404).json({ message: 'Latch Category not found' });
        }

        res.status(200).json({ message: 'Latch Category deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting Latch Category', error });
    }
});

module.exports = router;

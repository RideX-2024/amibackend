const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const DoorProtectProduct = require('../models/door_protector_product.model'); 
const DoorProtectCategory = require('../models/door_protector_category.model'); 
const router = express.Router();


// Get Door Protector Product by ID
router.get('/getById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        const data = await DoorProtectProduct.findById(id); 

        // Check if the Door Protector Product was found
        if (!data) {
            return res.status(404).json({ message: 'Door Protector Product not found' });
        }

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Door Protector Product', error });
    }
});

router.get('/door_protector_data', async (req, res) => {
    try {
        const data = await DoorProtectCategory.aggregate([
            {
                $lookup: {
                    from: 'door_protector_products', // Collection name in MongoDB
                    localField: '_id',
                    foreignField: 'door_protector_category_id',
                    as: 'products'
                }
            },
            {
                $sort: { createdAt: 1 } // Sort categories by createdAt descending
            }
        ]);
        //console.log(data);

        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error fetching door protector data:', error);
        res.status(500).json({ success: false, message: 'Server error', error });
    }
});

router.get('/getByCategory/:catId', async (req, res) => {
    try {
        const { catId } = req.params;

        // Fetch records where applied_on is the requested material or 'Both'
        const protect_door = await DoorProtectProduct.find({ door_protector_category_id: catId });

        res.status(200).json({ protect_door });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Hardware Product', error });
    }
});


// Get All
router.get('/getAll/', async (req, res) => {
    try {
        const data = await DoorProtectProduct.find();
        //console.log(fireRate);
        // Check if the Door Protector Product was found
        if (!data) {
            return res.status(404).json({ message: 'Door Protector Product not found' });
        }

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Door Protector Product', error });
    }
});

// Create Door Protector Product
router.post('/create_product', async (req, res) => {
    const { door_protector_category_id, title, description, product_image, price, isMultiSelection } = req.body;
    try {
        // Ensure latch_category_id is always an array
        //const latchCategoryArray = Array.isArray(latch_category_id) ? latch_category_id : [latch_category_id];

        // Check if a product with the same title exists
        const checkProduct = await DoorProtectProduct.findOne({ title });
        //console.log(checkProduct);
        if (checkProduct) {
            return res.status(400).json({ message: 'Door Protector Product with this title already exists' });
        }
        const newProduct = new DoorProtectProduct({
            door_protector_category_id: door_protector_category_id,
            title,
            description,
            product_image,
            price,
            isMultiSelection
        });
        await newProduct.save();

        res.status(200).json({ message: 'Door Protector Product created successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error creating Door Protector Product', error });
    }
}); 


router.put('/update_product/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters
    const { title, description, product_image, price, isMultiSelection, status } = req.body;
    //console.log(req.body);
    try {
        const data = await DoorProtectProduct.findByIdAndUpdate(
            id,
            { title, description, product_image, price, isMultiSelection, status, updatedAt: Date.now() },
            { new: true, runValidators: true } // Return the updated document and validate
        );
        //console.log(data);
        // Check if the Door Protector Product was found
        if (!data) {
            return res.status(404).json({ message: 'Door Protector Product not found' });
        }
        
        res.status(200).json({ message: 'Door Protector Product updated successfully'});
    } catch (error) {
        res.status(400).json({ message: 'Error updating Door Protector Product', error });
    }
});

// Delete Door Protector Product by ID
router.delete('/deleteById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        
        const deletedDoorProtectProduct = await DoorProtectProduct.findByIdAndDelete(id); // Find and delete the fire rated
        //console.log(deletedDoor);
        // Check if the fire rated was found
        if (!deletedDoorProtectProduct) {
            return res.status(404).json({ message: 'Door Protector Product not found' });
        }

        res.status(200).json({ message: 'Door Protector Product deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting Door Protector Product', error });
    }
});

router.delete('/deleteByUserJourneyID/:user_journey_id', async (req, res) => {
    const { door_protector_category_id } = req.params; // Get the category_id from request parameters

    try {
        const deleted = await DoorProtectProduct.deleteMany({ door_protector_category_id: new ObjectId(door_protector_category_id) });
        //console.log(deleted.deletedCount);
        if (deleted.deletedCount === 0) {
            return res.status(404).json({ message: 'No records found for the given category' });
        }

        res.status(200).json({ message: 'All records under the given Door Protector Category ID deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting records', error });
    }
});

module.exports = router;

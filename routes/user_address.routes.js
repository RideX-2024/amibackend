const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/user.model');
const UserAddress = require('../models/user_address.model');
const router = express.Router();


// Get Address by ID
router.get('/getById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        const data = await UserAddress.findById(id); 

        // Check if the Louver was found
        if (!data) {
            return res.status(404).json({ message: 'User Address not found' });
        }

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving User Address', error });
    }
});

// Get By product id
router.get('/getByUserId/:user_id/', async (req, res) => {
    const { user_id } = req.params; 
    try {
        const data = await UserAddress.find({  user_id: user_id, status: 'Active' }); 

        // Check if the User Address was found
        if (!data) {
            return res.status(404).json({ message: 'user Address not found' });
        }

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving User Address', error });
    }
});

// Get All
router.get('/getAll/', async (req, res) => {
    try {
        const data = await UserAddress.find({ status: 'Active' }).sort({ _id: 1 });

        // Check if the user Address was found
        if (!data) {
            return res.status(404).json({ message: 'User Address not found' });
        }

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving User Address', error });
    }
});

// Create User Address
router.post('/create_address', async (req, res) => {
    console.log("request Body", req.body);
    const { user_id, adress_type, first_name, last_name, company, stree_address, town, state, zip_code, email, mobile_no } = req.body;
    try {
        let address
        const checkProduct = await UserAddress.find({ adress_type: adress_type });
        console.log(checkProduct);
        if (checkProduct.length === 0) {
            address = new UserAddress({ user_id, adress_type, first_name, last_name, company, stree_address, town, state, zip_code, email, mobile_no });
            await address.save();
    
            res.status(200).json({ message: 'User Address created successfully' });
        } else {
            res.status(409).json({ message: 'Address with this type already exists' });
        }

    } catch (error) {
        res.status(400).json({ message: 'Error creating User Address', error });
    }
});


router.put('/update_address/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters
    const { adress_type, first_name, last_name, company, stree_address, town, state, zip_code, email, mobile_no } = req.body;
    console.log(req.body);
    try {
        const address = await UserAddress.findByIdAndUpdate(
            id,
            { adress_type, first_name, last_name, company, stree_address, town, state, zip_code, email, mobile_no, updatedAt: Date.now() },
            { new: true, runValidators: true } // Return the updated document and validate
        );
        
        // Check if the User Address was found
        if (!address) {
            return res.status(404).json({ message: 'User Address not found' });
        }
        
        res.status(200).json({ message: 'User Address updated successfully'});
    } catch (error) {
        res.status(400).json({ message: 'Error updating User Address', error });
    }
});

// Delete Louver by ID
router.delete('/deleteById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        
        const delAddress = await UserAddress.findByIdAndDelete(id); // Find and delete the Louver
        //console.log(deletedDoor);
        // Check if the User Address was found
        if (!delAddress) {
            return res.status(404).json({ message: 'User Address not found' });
        }

        res.status(200).json({ message: 'user Address deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting User Address', error });
    }
});

module.exports = router;

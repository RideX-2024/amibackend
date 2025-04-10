const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const QuotationProducts = require('../models/quotation_products.model'); 
const router = express.Router();


// Get Product by ID
router.get('/getById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        const products = await QuotationProducts.findById(id); 

        // Check if the company was found
        if (!products) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ products });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Product', error });
    }
});
/*
// Get By material
router.get('/getByCategory/:material', async (req, res) => {
    const { category, material } = req.params; 
    try {
        const Products = await QuotationProducts.find({ material: material }); 

        // Check if the company was found
        if (!Products) {
            return res.status(404).json({ message: 'Products not found' });
        }

        res.status(200).json({ Products });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Products', error });
    }
});
*/
// Get All
router.get('/getAll/', async (req, res) => {
    try {
        const products = await QuotationProducts.find({ status: 'Active'});

        // Check if the Product was found
        if (!products) {
            return res.status(404).json({ message: 'Products not found' });
        }

        res.status(200).json({ products });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Products', error });
    }
});

router.get('/enums', (req, res) => {
    const enums = {
      material: ['Wood', 'Metal','Building'],
      type: ['Wood Door', 'Metal Door', 'Building Door', 'Frame Only'],
      status: ['Active', 'Inactive']
    };
    res.status(200).json({ enums });
  });

// Create Product
router.post('/create_product', async (req, res) => {
    const { title, description, product_image, material, type, status } = req.body;
    try {
        let products
        const checkProduct = await QuotationProducts.find({ title: title });
        //console.log(checkProduct);
        products = new QuotationProducts({ title, description, product_image, material, type, status });
        await products.save();

        res.status(200).json({ message: 'Product created successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error creating Product', error });
    }
}); 


router.put('/update_product/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters
    const { title, description, product_image, material, type, status } = req.body;

    try {
        const products = await QuotationProducts.findByIdAndUpdate(
            id,
            { title, description, product_image, material, type, status, updatedAt: Date.now() },
            { new: true, runValidators: true } // Return the updated document and validate
        );
        // Check if the Product was found
        if (!products) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.status(200).json({ message: 'Product updated successfully'});
    } catch (error) {
        res.status(400).json({ message: 'Error updating Product', error });
    }
});

// Delete Product by ID
router.delete('/deleteById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters
    //console.log(id);
    try {
        
        const deletedProduct = await QuotationProducts.findByIdAndDelete(id); // Find and delete the Product
        //console.log(deletedDoor);
        // Check if the Product was found
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting Product', error });
    }
});

module.exports = router;

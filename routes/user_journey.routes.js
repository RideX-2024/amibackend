const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const QuptatipnProduct = require('../models/quotation_products.model');
const DoorCategory = require('../models/door_category.model');
const DoorHeight = require('../models/door_height.model');
const DoorWidth = require('../models/door_width.model');   
const UserJourney = require('../models/user_journey.model'); 
const UserJourneyDetail = require('../models/user_journey_detail.model'); 

const router = express.Router();


// Get Misc Category by ID
router.get('/getById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        const data = await UserJourney.findById(new ObjectId(id)); 

        // Check if the Misc Category was found
        if (!data) {
            return res.status(404).json({ message: 'User Journey not found' });
        }

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving User Journey', error });
    }
});

// Get Misc Category by ID
router.get('/getByProdId/:quot_prod_id', async (req, res) => {
    const { quot_prod_id } = req.params; // Get the ID from the request parameters

    try {
        const data = await UserJourney.findOne({quot_prod_id: quot_prod_id}); 

        // Check if the Misc Category was found
        if (!data) {
            return res.status(404).json({ message: 'User Journey not found' });
        }

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving User Journey', error });
    }
});

/*
// Get Misc Category by ID
router.get('/getUserJourneyData/:quot_prod_id', async (req, res) => {
    const { quot_prod_id } = req.params; // Get the ID from the request parameters

    try {
        const result = await UserJourney.aggregate([
            {
                $match: { quot_prod_id: new ObjectId(quot_prod_id) } // Match the given quot_prod_id
            },
            {
                $lookup: {
                    from: 'quotation_products', // Collection name (MongoDB uses pluralized form, check your collection name)
                    localField: 'quot_prod_id',
                    foreignField: '_id',
                    as: 'quotation_product_details'
                }
            },
            {
                $unwind: "$quotation_product_details" // Unwind the array to get object format
            }
        ]);
        res.status(200).json({ result });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving User Journey', error });
    }
});

router.get('/getUserJourneyData/:quot_prod_id', async (req, res) => {
    const { quot_prod_id } = req.params;

    try {
        const result = await UserJourney.aggregate([
            {
                $match: { quot_prod_id: new ObjectId(quot_prod_id) } // Match the given quot_prod_id
            },
            {
                $lookup: {
                    from: 'quotation_products', // Collection name in MongoDB
                    localField: 'quot_prod_id',
                    foreignField: '_id',
                    as: 'quotation_product_details'
                }
            },
            { $unwind: "$quotation_product_details" }, // Convert array to object

            // Lookup user_journey_detail by user_journey_id
            {
                $lookup: {
                    from: 'user_journey_details',
                    localField: '_id',
                    foreignField: 'user_journey_id',
                    as: 'user_journey_details'
                }
            },

            // Populate door_categories
            {
                $lookup: {
                    from: 'door_categories',
                    localField: 'user_journey_details.quot_prod_cat_id',
                    foreignField: '_id',
                    as: 'door_categories'
                }
            },

            // Populate door_types
            {
                $lookup: {
                    from: 'door_categories',
                    localField: 'user_journey_details.quot_prod_type_id',
                    foreignField: '_id',
                    as: 'door_types'
                }
            },

            // Populate width
            {
                $lookup: {
                    from: 'door_widths',
                    localField: 'user_journey_details.width_id',
                    foreignField: '_id',
                    as: 'door_widths'
                }
            },

            // Populate height
            {
                $lookup: {
                    from: 'door_heights',
                    localField: 'user_journey_details.height_id',
                    foreignField: '_id',
                    as: 'door_heights'
                }
            },

            // Populate door_hands
            {
                $lookup: {
                    from: 'door_hands',
                    localField: 'user_journey_details.door_hand_id',
                    foreignField: '_id',
                    as: 'door_hands'
                }
            },

            // Populate locations
            {
                $lookup: {
                    from: 'door_hands',
                    localField: 'user_journey_details.location_id',
                    foreignField: '_id',
                    as: 'locations'
                }
            }
        ]);

        res.status(200).json({ result });
    } catch (error) {
        console.error("Error fetching User Journey Data:", error);
        res.status(400).json({ message: 'Error retrieving User Journey', error });
    }
});
*/

///2nd Query
router.get('/getUserJourneyData/:quot_prod_id', async (req, res) => {
    const { quot_prod_id } = req.params;

    try {
        const result = await UserJourney.aggregate([
            {
                $match: { quot_prod_id: new ObjectId(quot_prod_id) } // Match the given quot_prod_id
            },
            {
                $lookup: {
                    from: 'quotation_products',
                    localField: 'quot_prod_id',
                    foreignField: '_id',
                    as: 'quotation_product_details'
                }
            },
            { $unwind: "$quotation_product_details" },

            // Lookup user_journey_details by user_journey_id
            {
                $lookup: {
                    from: 'user_journey_details',
                    localField: '_id',
                    foreignField: 'user_journey_id',
                    as: 'user_journey_details'
                }
            },

            { $unwind: "$user_journey_details" }, // Unwind user_journey_details

            // Lookup door_types based on quot_prod_type_id inside user_journey_details
            {
                $lookup: {
                    from: 'door_categories',
                    localField: 'user_journey_details.quot_prod_type_id',
                    foreignField: '_id',
                    as: 'user_journey_details.door_types'
                }
            },

            // Lookup door_categories based on quot_prod_cat_id inside user_journey_details
            {
                $lookup: {
                    from: 'door_categories',
                    localField: 'user_journey_details.quot_prod_cat_id',
                    foreignField: '_id',
                    as: 'user_journey_details.door_categories'
                }
            },

            // Lookup door_widths based on width_id inside user_journey_details
            {
                $lookup: {
                    from: 'door_widths',
                    localField: 'user_journey_details.width_id',
                    foreignField: '_id',
                    as: 'user_journey_details.door_widths'
                }
            },

            // Lookup door_heights based on height_id inside user_journey_details
            {
                $lookup: {
                    from: 'door_heights',
                    localField: 'user_journey_details.height_id',
                    foreignField: '_id',
                    as: 'user_journey_details.door_heights'
                }
            },

            // Lookup door_hands based on door_hand_id inside user_journey_details
            {
                $lookup: {
                    from: 'door_hands',
                    localField: 'user_journey_details.door_hand_id',
                    foreignField: '_id',
                    as: 'user_journey_details.door_hands'
                }
            },

            // Lookup locations based on location_id inside user_journey_details
            {
                $lookup: {
                    from: 'misc_products', // Assuming location data is in the same collection as door_hands
                    localField: 'user_journey_details.location_id',
                    foreignField: '_id',
                    as: 'user_journey_details.locations'
                }
            },

            {
                $lookup: {
                    from: 'fire_rateds', // Assuming location data is in the same collection as door_hands
                    localField: 'user_journey_details.fire_rated_id',
                    foreignField: '_id',
                    as: 'user_journey_details.fire_rated'
                }
            },
            
            {
                $lookup: {
                    from: 'lite_kit_glasses', // Assuming location data is in the same collection as door_hands
                    localField: 'user_journey_details.lite_kit_id',
                    foreignField: '_id',
                    as: 'user_journey_details.lite_kit'
                }
            },
            
            {
                $lookup: {
                    from: 'louvers', // Assuming location data is in the same collection as door_hands
                    localField: 'user_journey_details.louvers_id',
                    foreignField: '_id',
                    as: 'user_journey_details.louvers'
                }
            },

            {
                $lookup: {
                    from: 'door_categories',
                    localField: 'user_journey_details.quot_prod_frame_id',
                    foreignField: '_id',
                    as: 'user_journey_details.door_frames'
                }
            },

            {
                $lookup: {
                    from: 'anchor_types',
                    localField: 'user_journey_details.anchor_type_id',
                    foreignField: '_id',
                    as: 'user_journey_details.built_option'
                }
            },
            
            {
                $lookup: {
                    from: 'jamb_depth_frames',
                    localField: 'user_journey_details.jamb_depth_id',
                    foreignField: '_id',
                    as: 'user_journey_details.jamb_depth'
                }
            },

            {
                $lookup: {
                    from: 'misc_products',
                    localField: 'user_journey_details.misc_cate_hang_door_id',
                    foreignField: '_id',
                    as: 'user_journey_details.hang_door'
                }
            },
            
            {
                $lookup: {
                    from: 'latch_categories',
                    localField: 'user_journey_details.latch_category_id',
                    foreignField: '_id',
                    as: 'user_journey_details.latch_category'
                }
            },

            {
                $lookup: {
                    from: 'latch_sub_categories',
                    localField: 'user_journey_details.latch_prod_id',
                    foreignField: '_id',
                    as: 'user_journey_details.latch_products'
                }
            },

            {
                $lookup: {
                    from: 'latch_sub_devices',
                    localField: 'user_journey_details.latch_sub_prod_id',
                    foreignField: '_id',
                    as: 'user_journey_details.latch_sub_prod'
                }
            },
            
            {
                $lookup: {
                    from: 'misc_products',
                    localField: 'user_journey_details.door_control_id',
                    foreignField: '_id',
                    as: 'user_journey_details.door_control'
                }
            },
            {
                $lookup: {
                    from: 'door_protector_categories',
                    localField: 'user_journey_details.door_protect_id',
                    foreignField: '_id',
                    as: 'user_journey_details.door_protect'
                }
            },
            {
                $lookup: {
                    from: 'misc_products',
                    localField: 'user_journey_details.add_on_id',
                    foreignField: '_id',
                    as: 'user_journey_details.add_ons'
                }
            },
            {
                $lookup: {
                    from: 'hardware_products',
                    localField: 'user_journey_details.hardware_finish_id',
                    foreignField: '_id',
                    as: 'user_journey_details.hardware_finish'
                }
            },
            {
                $lookup: {
                    from: 'hardware_products',
                    localField: 'user_journey_details.hardware_grade_id',
                    foreignField: '_id',
                    as: 'user_journey_details.hardware_grade'
                }
            },
            {
                $lookup: {
                    from: 'hardware_products',
                    localField: 'user_journey_details.hardware_brand_id',
                    foreignField: '_id',
                    as: 'user_journey_details.hardware_brand'
                }
            },            

            // Re-grouping all user_journey_details into an array under their respective user journey
            {
                $group: {
                    _id: "$_id",
                    quot_prod_id: { $first: "$quot_prod_id" },
                    description: { $first: "$description" },
                    createdAt: { $first: "$createdAt" },
                    updatedAt: { $first: "$updatedAt" },
                    quotation_product_details: { $first: "$quotation_product_details" },
                    user_journey_details: { $push: "$user_journey_details" } // Group back into an array
                }
            }
        ]);

        res.status(200).json({ result });
    } catch (error) {
        console.error("Error fetching User Journey Data:", error);
        res.status(400).json({ message: 'Error retrieving User Journey', error });
    }
});



// Get All
router.get('/getAll/', async (req, res) => {
    try {
        const data = await UserJourney.find();
        // Check if the Misc Category was found
        if (!data) {
            return res.status(404).json({ message: 'User Joureny not found' });
        }

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving User Joureny', error });
    }
});

// Create User Journey
router.post('/create_journey', async (req, res) => {
    const { quot_prod_id, description } = req.body;
    const prodId = quot_prod_id[0];
    //console.log(prodId);
    try {
        let data
        const checkProduct = await UserJourney.findOne({ quot_prod_id: prodId });
        //console.log(checkProduct.length);
        if (checkProduct == null){
        //if (checkProduct.length == 0 || checkProduct == null){
            //console.log("Creating Journey");
            data = new UserJourney({ quot_prod_id: prodId, description });
            await data.save();
            res.status(200).json({ message: 'User Joureny created successfully', data: data })
        } else {
            //console.log("Journey Already Exist");
            res.status(202).json({ message: 'User Joureny already exist', journeyId: checkProduct._id })
        }
    } catch (error) {
        res.status(400).json({ message: 'Error creating User Joureny', error });
    }
}); 

/*
router.put('/update_misc_category/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters
    const { title, description, misc_image, status } = req.body;

    try {
        const data = await MiscCategory.findByIdAndUpdate(
            id,
            { title, description, misc_image, status, updatedAt: Date.now() },
            { new: true, runValidators: true } // Return the updated document and validate
        );
        // Check if the Misc Category was found
        if (!data) {
            return res.status(404).json({ message: 'Misc Category not found' });
        }
        
        res.status(200).json({ message: 'Misc Category updated successfully'});
    } catch (error) {
        res.status(400).json({ message: 'Error updating Misc Category', error });
    }
});
*/
// Delete Misc Category by ID
router.delete('/deleteById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        //console.log(id);
        const deleteUserJourneyDetail = await UserJourneyDetail.deleteMany({ user_journey_id: new ObjectId(id) });
        //console.log((await deleteUserJourneyDetail).deletedCount);
        if (!deleteUserJourneyDetail) {
            //return res.status(404).json({ message: 'User Journey Detail not found' });
        }        
        const deleteUserJourney = await UserJourney.findByIdAndDelete({ _id: new ObjectId(id) }); // Find and delete the Misc Category
        //console.log(deletedDoor);
        // Check if the Misc Category was found
        if (!deleteUserJourney) {
            return res.status(404).json({ message: 'User Journey not found' });
        }

        res.status(200).json({ message: 'User Journey deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting User Journey', error });
    }
});



module.exports = router;

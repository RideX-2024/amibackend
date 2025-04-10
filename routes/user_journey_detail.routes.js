const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const UserJourney = require('../models/user_journey.model'); 
const DoorCategory = require('../models/door_category.model');
const DoorHeight = require('../models/door_height.model');
const DoorWidth = require('../models/door_width.model');
const DoorHand = require('../models/door_hand.model');   
const UserJourneyDetail = require('../models/user_journey_detail.model'); 
const router = express.Router();


// Get Misc Category by ID
/*
router.get('/getById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        const data = await UserJourneyDetail.findById(id); 

        // Check if the Misc Category was found
        if (!data) {
            return res.status(404).json({ message: 'Misc Category not found' });
        }

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Misc Category', error });
    }
});

// Get All
router.get('/getAll/', async (req, res) => {
    try {
        const data = await MiscCategory.find();
        // Check if the Misc Category was found
        if (!data) {
            return res.status(404).json({ message: 'Misc Category not found' });
        }

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Misc Category', error });
    }
});
*/

router.get('/getByUserJourneyID/:UserJourneyId', async (req, res) => {
    const { UserJourneyId } = req.params; // Get the ID from the request parameters

    try {
        const data = await UserJourneyDetail.find({ user_journey_id: UserJourneyId })
            .select('-createdAt -updatedAt -__v');

        // Check if data exists
        if (!data || data.length === 0) {
            return res.status(404).json({ message: 'No data found' });
        }

        // Function to remove empty fields from an object
        const removeEmptyFields = (obj) => {
            return Object.fromEntries(
                Object.entries(obj).filter(([_, value]) => 
                    value !== null && value !== undefined && 
                    (!(Array.isArray(value)) || value.length > 0)
                )
            );
        };

        // Process and filter out empty fields from each document
        const filteredData = data.map(item => removeEmptyFields(item.toObject()));

        res.status(200).json({ data: filteredData });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving data', error });
    }
});



router.get('/journey_data/:user_journey_id', async (req, res) => {
    const { user_journey_id } = req.params;
    try {
        //console.log("Query Start");
        if (!ObjectId.isValid(user_journey_id)) {
            return res.status(400).json({ success: false, message: 'Invalid user_journey_id' });
        }        
        
        const userJourneyDetails = await UserJourneyDetail.aggregate([
            {
                $match: {
                    user_journey_id: new ObjectId(user_journey_id)
                }
            },
            {
                $lookup: {
                    from: "door_categories",
                    localField: "quot_prod_cat_id",
                    foreignField: "_id",
                    as: "door_categories"
                }
            },
            {
                $lookup: {
                    from: "door_categories",
                    localField: "quot_prod_type_id",
                    foreignField: "_id",
                    as: "door_types"
                }
            },
            {
                $lookup: {
                    from: "door_widths",
                    localField: "width_id",
                    foreignField: "_id",
                    as: "width_details"
                }
            },
            {
                $lookup: {
                    from: "door_heights",
                    localField: "height_id",
                    foreignField: "_id",
                    as: "height_details"
                }
            },
            {
                $lookup: {
                    from: "door_hands",
                    localField: "door_hand_id",
                    foreignField: "_id",
                    as: "door_hands"
                }
            },            
            {
                $match: {
                    $or: [
                        { door_categories: { $ne: [] } },
                        { door_types: { $ne: [] } },
                        { width_details: { $ne: [] } },
                        { height_details: { $ne: [] } },
                        { door_hands: { $ne: [] } }
                    ]
                }
            },
            {
                $project: {
                    _id: 1,
                    sequence_id: 1,
                    title: 1,
                    door_categories: {
                        $cond: {
                            if: { $eq: ["$door_categories", []] },
                            then: "$$REMOVE",
                            else: "$door_categories"
                        }
                    },
                    door_types: {
                        $cond: {
                            if: { $eq: ["$door_types", []] },
                            then: "$$REMOVE",
                            else: "$door_types"
                        }
                    },
                    width_details: {
                        $cond: {
                            if: { $eq: ["$width_details", []] },
                            then: "$$REMOVE",
                            else: "$width_details"
                        }
                    },
                    height_details: {
                        $cond: {
                            if: { $eq: ["$height_details", []] },
                            then: "$$REMOVE",
                            else: "$height_details"
                        }
                    },
                    door_hands: {
                        $cond: {
                            if: { $eq: ["$door_hands", []] },
                            then: "$$REMOVE",
                            else: "$door_hands"
                        }
                    },                    
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ]).exec();
        //console.log("Query End");
        //console.log(userJourneyDetails);

        res.status(200).json({ success: true, userJourneyDetails });
    } catch (error) {
        console.error('Error fetching hardware data:', error);
        res.status(500).json({ success: false, message: 'Server error', error });
    }
});

// Create Misc Category
router.post('/create_journey_detail', async (req, res) => {
    const { user_journey_id, sequence_id, title, product_id } = req.body;

    try {
        //console.log(product_id);
        if (!Array.isArray(product_id) || product_id.length === 0) {
            return res.status(400).json({ message: 'product_id must be a non-empty array' });
        }

        // Check if a record with user_journey_id and title exists, if so delete it
        await UserJourneyDetail.deleteMany({ user_journey_id: user_journey_id, title: title });

        // Check if a record with user_journey_id and sequence_id exists, if so delete it
        await UserJourneyDetail.deleteMany({ user_journey_id: user_journey_id, sequence_id: sequence_id });

        // Determine where to store the product_id based on product_type
        let dataToSave = {
            user_journey_id,
            sequence_id,
            title,
        };

        if (title === 'Categories') { //1
            dataToSave.quot_prod_cat_id = product_id;
        } else if (title === 'Types') {  //2
            dataToSave.quot_prod_type_id = product_id;
        } else if (title === 'Door Width') {  //3
            dataToSave.width_id = product_id;
        } else if (title === 'Door Height') {  //4
            dataToSave.height_id = product_id;
        } else if (title === 'Door Hand') {  //5
            dataToSave.door_hand_id = product_id;
        } else if (title === 'Location') {  //6
            dataToSave.location_id = product_id;
        } else if (title === 'Fire Rated') {  //7
            dataToSave.fire_rated_id = product_id;
        } else if (title === 'Lite Kit') {  //8
            dataToSave.lite_kit_id = product_id;
        } else if (title === 'Louver') {  //9
            dataToSave.louvers_id = product_id;
        } else if (title === 'Frames') {  //10
            dataToSave.quot_prod_frame_id = product_id;
        } else if (title === 'Built Option') {  //11
            dataToSave.anchor_type_id = product_id;
        } else if (title === 'Wall Thickness') {  //12
            dataToSave.jamb_depth_id = product_id;
        } else if (title === 'Hang Door') {  //13
            dataToSave.misc_cate_hang_door_id = product_id;
        } else if (title === 'Latches') {  //14
            dataToSave.latch_category_id = product_id;
        } else if (title === 'Lock Functions') {  //15
            dataToSave.latch_prod_id = product_id;
        } else if (title === 'Deadbolt Type') {  //16
            dataToSave.latch_sub_prod_id = product_id;
        } else if (title === 'Control Door') {  //17
            dataToSave.door_control_id = product_id;
        } else if (title === 'Protect Door') {  //18
            dataToSave.door_protect_id = product_id;
        } else if (title === 'Add On') {  //19
            dataToSave.add_on_id = product_id;
        } else if (title === 'Hardware Finish') {  //20
            dataToSave.hardware_finish_id = product_id;
        } else if (title === 'Hardware Grade') {  //21
            dataToSave.hardware_grade_id = product_id;
        } else if (title === 'hardware Brand') {  //22
            dataToSave.hardware_brand_id = product_id;
        } else {
            console.log("Error something wrong");
            return res.status(400).json({ message: 'Invalid product_type provided' });
        }

        // Create and save new record
        const newData = new UserJourneyDetail(dataToSave);
        await newData.save();

        return res.status(201).json({ message: 'User Journey created successfully', data: newData });
    } catch (error) {
        console.error('Error creating User Journey:', error);
        return res.status(500).json({ message: 'Error creating User Journey', error });
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
        
        const deleted = await UserJourneyDetail.findByIdAndDelete(id); // Find and delete the Misc Category
        //console.log(deletedDoor);
        // Check if the Misc Category was found
        if (!deleted) {
            return res.status(404).json({ message: 'User Journey Detail not found' });
        }

        res.status(200).json({ message: 'User Journey Detail deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting User Journey Detail', error });
    }
});

// Delete Misc Category by ID
router.delete('/deleteByUserJourneyID/:user_journey_id', async (req, res) => {
    const { user_journey_id } = req.params; // Get the category_id from request parameters

    try {
        const deleted = await UserJourneyDetail.deleteMany({ user_journey_id: new ObjectId(user_journey_id) }); // Delete all records with the matching category_id
        //console.log(deleted.deletedCount);
        if (deleted.deletedCount === 0) {
            return res.status(404).json({ message: 'No records found for the given category' });
        }

        res.status(200).json({ message: 'All records under the given user journey ID deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting records', error });
    }
});


module.exports = router;

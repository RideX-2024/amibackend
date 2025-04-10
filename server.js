const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

const app = express();
//app.use(cors());

app.use(cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept'
  }));


//Serve static files from the 'public' folder
app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.use(bodyParser.json());

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// Import Routes
const userRoutes = require('./routes/user.routes');
const anchorTypeRoutes = require('./routes/anchor_type.routes');
const doorHeightRoutes = require('./routes/door_height.routes');
const doorWidthRoutes = require('./routes/door_width.routes');
const quoProductsRoutes = require('./routes/quotation_products.routes');
const doorCategoryRoutes = require('./routes/door_category.routes');
const doorTypeRoutes = require('./routes/door_type.routes');
const fireRatedRoutes = require('./routes/fire_rated.routes');
const liteKitGlassRoutes = require('./routes/lite_kit_glass.routes');
const louverRoutes = require('./routes/louver.routes');
const wallThicknessRoutes = require('./routes/wall_thickness.routes');
const jambDepthRoutes = require('./routes/jamb_depth_frame.routes');
const doorHandRoutes = require('./routes/door_hand.routes');
const woodSurfaceRoutes = require('./routes/wood_surface.routes');
const latchCategoryRoutes = require('./routes/latch_categories.routes');
const latchSubCategoryRoutes = require('./routes/latch_sub_category.routes');
const latchProductRoutes = require('./routes/latch_products.routes');
const latchSubDeviceRoutes = require('./routes/latch_sub_device.routes');
const latchSubProductRoutes = require('./routes/latch_sub_dev_products.routes');
const doorProtectCategoryRoutes = require('./routes/door_protector_category.routes');
const doorProtectProductRoutes = require('./routes/door_protector_product.routes');
const hardwareCategoryRoutes = require('./routes/hardware_category.routes');
const hardwareProductRoutes = require('./routes/hardware_products.routes');
const miscCategoryRoutes = require('./routes/misc_categories.routes');
const miscProductRoutes = require('./routes/misc_products.routes');
const userJourneyRoutes = require('./routes/user_journey.routes');
const userJourneyDetailRoutes = require('./routes/user_journey_detail.routes');
const userQuotationRoutes = require('./routes/quotation_user.routes');
const userQuotationMasterRoutes = require('./routes/user_quotation_master.routes');
const glassTypeRoutes = require('./routes/glass_type.routes');
const userAddressRoutes = require('./routes/user_address.routes');


// Use Routes
app.use('/api/users', userRoutes);

app.use('/api/anchorType', anchorTypeRoutes);
app.use('/api/doorHeight', doorHeightRoutes);
app.use('/api/doorWidth', doorWidthRoutes);
app.use('/api/quotProduct', quoProductsRoutes);
app.use('/api/doorCate', doorCategoryRoutes);
app.use('/api/doorType', doorTypeRoutes);
app.use('/api/fireRated', fireRatedRoutes);
app.use('/api/liteKitGlass', liteKitGlassRoutes);
app.use('/api/louver', louverRoutes);
app.use('/api/wallThickness', wallThicknessRoutes);
app.use('/api/jambDepth', jambDepthRoutes);
app.use('/api/doorHand', doorHandRoutes);
app.use('/api/woodSurface', woodSurfaceRoutes);
app.use('/api/latchCategory', latchCategoryRoutes);
app.use('/api/latchSubCategory', latchSubCategoryRoutes);
app.use('/api/latchProduct', latchProductRoutes);

app.use('/api/latchSubDevice', latchSubDeviceRoutes);
app.use('/api/latchSubProduct', latchSubProductRoutes);

app.use('/api/doorProtectCategory', doorProtectCategoryRoutes);
app.use('/api/doorProtectProduct', doorProtectProductRoutes);
app.use('/api/hardwareCategory', hardwareCategoryRoutes);
app.use('/api/hardwareProduct', hardwareProductRoutes);
app.use('/api/miscCategory', miscCategoryRoutes);
app.use('/api/miscProduct', miscProductRoutes);
app.use('/api/userJourney', userJourneyRoutes);
app.use('/api/userJourneyDetail', userJourneyDetailRoutes);
app.use('/api/userQuotation', userQuotationRoutes);
app.use('/api/userQuotationMaster', userQuotationMasterRoutes);
app.use('/api/userAddress', userAddressRoutes);
app.use('/api/glassType', glassTypeRoutes);


// Start the Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

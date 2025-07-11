require('dotenv').config();

const express=require('express');
const routes=express.Router();

// user routes
const userRoutes=require('./routes/userRoute/index');



// astrologer routes
const astroRoutes=require('./routes/astrologerRoute/index');
const storeRoutes=require('./routes/store/index');

routes.use(astroRoutes);
routes.use(userRoutes);
routes.use(storeRoutes);


module.exports=routes
require('dotenv').config();

const express=require('express');
const routes=express.Router();

// user routes
const userRoutes=require('./routes/userRoute/index');

// astrologer routes
const astroRoutes=require('./routes/astrologerRoute/index')

routes.use(astroRoutes)
routes.use(userRoutes);


module.exports=routes
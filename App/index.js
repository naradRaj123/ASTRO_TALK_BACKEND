require('dotenv').config();

const express=require('express');
const routes=express.Router();

// user routes
const userRoutes=require('./routes/userRoute/index');



// astrologer routes
const astroRoutes=require('./routes/astrologerRoute/index');
const storeRoutes=require('./routes/store/index');

// payment routs
const paymentRoutes=require('./routes/paymentRoutes/index')

// serices-api 
const serviceApiRoutes=require('./routes/service-apiRoute/index')

routes.use(astroRoutes);
routes.use(userRoutes);
routes.use(storeRoutes);
routes.use(paymentRoutes)
routes.use(serviceApiRoutes);

module.exports=routes
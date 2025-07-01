require('dotenv').config();

const express=require('express');
const routes=express.Router();

// user routes
const userRoutes=require('./routes/userRoute/index');


// ✅ Add this health route
// routes.get('/', (req, res) => {
//   res.status(200).json({ status: true, msg: 'API is working and connected to database' });
// });

// astrologer routes
const astroRoutes=require('./routes/astrologerRoute/index');
const storeRoutes=require('./routes/store/index');

routes.use(astroRoutes);
routes.use(userRoutes);
routes.use(storeRoutes);


module.exports=routes
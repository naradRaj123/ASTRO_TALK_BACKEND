require('dotenv').config();

const express=require('express');
const routes=express.Router();

// user routes
const userRoutes=require('./routes/userRoute/index');

routes.use(userRoutes);


module.exports=routes
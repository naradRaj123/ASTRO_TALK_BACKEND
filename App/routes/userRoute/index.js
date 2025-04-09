require('dotenv').config();

const express=require('express');
const router=express.Router();

const userController=require('../../controller/userController/index')


router.post('/web/register',userController.userRegister);

module.exports=router
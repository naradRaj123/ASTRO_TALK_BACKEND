require('dotenv').config();

const express=require('express');
const router=express.Router();

const userController=require('../../controller/userController/index')


router.post('/web/register',userController.userRegister);
router.post('/web/login',userController.loginUser);
module.exports=router
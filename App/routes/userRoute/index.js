require('dotenv').config();

const express=require('express');
const router=express.Router();

const userController=require('../../controller/userController/index')


router.post('/web/register',userController.userRegister);
router.post('/web/login',userController.loginUser);
router.post('/web/userDataById/:id',userController.UserInfoById);
router.post('/web/user/update',userController.EditByUserId);
module.exports=router
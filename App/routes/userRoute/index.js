require('dotenv').config();

const express=require('express');
const router=express.Router();
const upload=require('../../multer');
const userController=require('../../controller/userController/index')


router.post('/web/register',userController.userRegister);
router.post('/web/login',userController.loginUser);
router.post('/web/userDataById/:id',userController.UserInfoById);
router.post('/web/user/update',upload.single('user_image'),userController.EditByUserId);
router.get('/web/user/userlist',userController.Userlist)

//admin api
router.post('/admin/userupdate',userController.UpdateStatus);

module.exports=router
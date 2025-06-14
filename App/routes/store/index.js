require('dotenv').config();
const express=require('express');

const router=express.Router();

const StoreModal=require('../../modal/category/index');
const CategoryController=require('../../controller/product/category/index');
const upload=require('../../multer');

router.post('/web/addcate',upload.single('coverimg'),CategoryController.AddCategory);

module.exports=router
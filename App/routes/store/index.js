require('dotenv').config();
const express=require('express');

const router=express.Router();


const productController=require('../../controller/productController/index');
const upload=require('../../multer');

router.post('/web/addproduct',upload.single('coverimg'),productController.AddProduct);
router.post('/paynow',productController.Paynow);

module.exports=router
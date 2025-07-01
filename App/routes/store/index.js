require('dotenv').config();
const express=require('express');

const router=express.Router();


const productController=require('../../controller/productController/index');
const upload=require('../../multer');

router.post('/web/addproduct',upload.single('image'),productController.AddProduct);
router.get('/web/productlist',productController.ProductList);
router.get('/web/getProductById/:id',productController.GetProductById);
router.post('/web/productUpdate/:id',upload.single('image'),productController.UpdateProduct);
router.post('/paynow',productController.Paynow);

module.exports=router
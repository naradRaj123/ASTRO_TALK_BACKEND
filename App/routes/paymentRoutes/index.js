require('dotenv').config();

const express=require('express');

const paymentController=require('../../controller/paymentController/index');

const router=express.Router();

// get payment request list
router.get('/web/paymentRequest',paymentController.paymentRequestList);
router.post('/web/create-order',paymentController.createOrder);


module.exports=router;
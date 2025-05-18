require('dotenv').config();

const express=require('express');

const router=express.Router();
const astroController=require('../../controller/astrologer/index')
const singUploadImage=require('../../multer');

// router.post('/web/astro',singUploadImage.single('img'),astroController.registerAstrologer)
router.post('/web/astro',astroController.registerAstrologer)

module.exports=router;
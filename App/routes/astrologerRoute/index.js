require('dotenv').config();

const express=require('express');

const router=express.Router();
const astroController=require('../../controller/astrologer/index')
const upload=require('../../multer');

router.post('/web/astro',upload.fields([{ name: 'profileimg', maxCount: 1 }, { name: 'govDoc', maxCount: 1 }]),astroController.registerAstrologer)
router.post('/web/astro/login',astroController.loginAstro)

module.exports=router;
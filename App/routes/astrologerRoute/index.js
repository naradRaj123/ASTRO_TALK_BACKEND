require('dotenv').config();

const express=require('express');

const router=express.Router();
const astroController=require('../../controller/astrologer/index')
const upload=require('../../multer');

router.post('/web/astro',upload.fields([{ name: 'profileimg', maxCount: 1 }, { name: 'govDoc', maxCount: 1 }]),astroController.registerAstrologer)
router.post('/web/astro/login',astroController.loginAstro);
router.post('/web/astro/loginMob',astroController.loginWithMobile);
router.get('/web/astro/astrolist',astroController.astrolist);

// astrologer audio call
// router.post('/api/start-call',astroController.astroCall)

// get token for calling
router.get('/web/agora/token',astroController.GetToken)

// get token for astrologer calling
router.get('/web/agora/astro/token',astroController.GetTokenOfAstrologer);

module.exports=router;
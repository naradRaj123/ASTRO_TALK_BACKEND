require('dotenv').config();

const express=require('express');

const router=express.Router();
const astroController=require('../../controller/astrologer/index')
const paymentController=require('../../controller/paymentController/index')
const upload=require('../../multer');

router.post('/web/astro',upload.fields([{ name: 'profileimg', maxCount: 1 }, { name: 'govDoc', maxCount: 1 }]),astroController.registerAstrologer)
router.post('/web/astro/login',astroController.loginAstro);
router.post('/web/astro/loginMob',astroController.loginWithMobile);
router.get('/web/astro/astrolist',astroController.astrolist);
router.post('/web/astro/updateById/:id',upload.single('profileImg'),astroController.UpdateAstroProfile);
router.post('/web/astro/sendOtp',astroController.SendAstroOTPByEmail);
router.post('/web/astro/verifyOtp',astroController.VerifyAstroOTP);
router.post('/web/astro/resetPassword',astroController.ResetPasswordAstroAfterOTP);
router.post('/web/astro/astrolinfo',astroController.AstrologerInfoById);
// withdrawal
router.post('/create-order',paymentController.createOrder);


// astrologer audio call
// router.post('/api/start-call',astroController.astroCall)

// get token for calling
router.get('/web/agora/token',astroController.GetToken)

// get token for astrologer calling
router.get('/web/agora/astro/token',astroController.GetTokenOfAstrologer);


// admin api action
router.post('/admin/astroUpdate',astroController.AstroAction);
router.post('/admin/astroChargeUpdate',astroController.UpdateChargeById);


module.exports=router;
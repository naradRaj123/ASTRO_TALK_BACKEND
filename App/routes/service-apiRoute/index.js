const express=require('express');

const router=express.Router();

const serviceController=require('../../controller/service-api/index')

router.post('/prediction/daily',serviceController.DailyHoroscope);
router.get('/matching/dashakoot',serviceController.MatchMakingDashakoot);
router.get('/matching/ashakoot',serviceController.MatchMakingAashakoot);


module.exports=router
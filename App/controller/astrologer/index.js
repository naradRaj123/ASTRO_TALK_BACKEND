const nodemailer = require('nodemailer');

const bcrypt = require('bcryptjs');
const astroSchema=require('../../modal/astrologer/index')
const bodyParser=require('body-parser');
const fs=require('fs')
const path=require('path');
const { model } = require('mongoose');



exports.registerAstrologer=async(req,res)=>{
    const {astroName,astroDob,mobile,email,password,city,experience,expertise,langauge,shortBio,chargePerSession,availableTime,bankDetails}=req.body;

    const profileImg = req.files?.profileImg?.[0]?.filename || null;
    const verifyDocument = req.files?.verifyDocument?.[0]?.filename || null;


    try{
    if (!astroName || !mobile || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    // hashPassword
    // const hashedPassword = await bcrypt.hash(password, 10)
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);

     const newAstrologer = new astroSchema({
      astroName,
      astroDob,
      mobile,
      email,
      password:hashPassword, // use hashedPassword in real case
      city,
      experience,
      expertise,
      langauge,
      shortBio,
      chargePerSession,
      availableTime,
      bankDetails,
      profileImg,
      verifyDocument,
      isApproved: false, // default
      createdAt: new Date()
    });

    // save astrologer
    const astroResponse = await newAstrologer.save();
    if(astroResponse){
        return res.status(200).json({ status: true, msg: `Registration completed successfully.` });
    }
      }catch(error){
         console.error("Registration error:", error);

        if (error?.errorResponse?.keyPattern?.email) {
            return res.status(409).json({ status: 0, msg: 'Email already exists. Please try another email.' });
        }

        return res.status(500).json({ status: 0, msg: 'Registration failed. Something went wrong.', error: error.message });
    }

}


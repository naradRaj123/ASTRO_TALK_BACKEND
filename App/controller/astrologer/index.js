require('dotenv').config();

const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const astroSchema = require('../../modal/astrologer/index')
const bodyParser = require('body-parser');
const fs = require('fs')
const path = require('path');
const { model } = require('mongoose');

const deleteFileIfExists = (filepath) => {
  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath);
  }
};


// astrologer register
exports.registerAstrologer = async (req, res) => {
  const { astroName, astroDob, mobile, email, password, city, experience, expertise, langauge, shortBio, chargePerSession, availableTime, bankDetails } = req.body;

  const profilePic = req.files?.profileimg?.[0]?.filename || null;
  const govDoc = req.files?.govDoc?.[0]?.filename || null

  // base 64 
  // const profileImgBase64 = profilePic
  //     ? fs.readFileSync(path.join(__dirname, '../../../upload', profilePic), 'base64')
  //     : null;
  // const profileImgDataUrl = profileImgBase64
  //     ? `data:${profilePic.mimetype};base64,${profileImgBase64}`
  //     : null;

  // console.log(profileImgDataUrl?.slice(0, 100))

  try {
    if (!astroName || !mobile || !email || !password) {
      if (profileImg) deleteFileIfExists(`upload/${profilePic}`);
      if (govDoc) deleteFileIfExists(`upload/${govDoc}`);
      return res.status(400).json({ status: false, msg: 'Missing required fields.' });
    }

    // check mail already exit
    const isMailFound = await astroSchema.findOne({ email });
    if (isMailFound) {
      if (profilePic) deleteFileIfExists(`upload/${profilePic}`);
      if (govDoc) deleteFileIfExists(`upload/${govDoc}`);
      return res.status(302).json({ status: true, msg: "Email already exists. Try another." })
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
      password: hashPassword, // use hashedPassword in real case
      city,
      experience,
      expertise,
      langauge,
      shortBio,
      chargePerSession,
      availableTime,
      bankDetails,
      profileImg: profilePic,
      verifyDocument: govDoc,
      isApproved: false, // default
      createdAt: new Date()
    });

    // save astrologer
    const astroResponse = await newAstrologer.save();
    if (astroResponse) {
      return res.status(200).json({ status: true, msg: `Registration completed successfully.` });
    }
  } catch (error) {
    console.error("Registration error:", error);
    if (profileImg) deleteFileIfExists(`upload/${profileImg}`);
    if (govDoc) deleteFileIfExists(`upload/${govDoc}`);
    if (error?.errorResponse?.keyPattern?.email) {
      return res.status(409).json({ status: 0, msg: 'Email already exists. Please try another email.' });
    }

    return res.status(500).json({ status: 0, msg: 'Registration failed. Something went wrong.', error: error.message });
  }

}


// astrologer login
exports.loginAstro = async (req, res) => {
  const { email, password } = req.body

  try {

    // missing field require
    if (!email || !password) { return res.status(400).json({ status: false, msg: "Missing required fields." }) }

    // email exits or not
    const isValidAstro = await astroSchema.findOne({ email });
    if (!isValidAstro) return res.status(404).json({ status: true, msg: "Email not registered." })

    // Compare password
    const isMatch = await bcrypt.compare(password, isValidAstro.password);
    if (!isMatch) {
      return res.status(401).json({ status: 0, msg: "Incorrect password" });
    }

    if (!process.env.JWT_TOKEN_KEY) {
      return res.status(401).json({ status: false, msg: "JWT_TOKEN_KEY is not defined in environment variables." });
    }

    // Create JWT token
    const token = jwt.sign({ id: isValidAstro._id }, process.env.JWT_TOKEN_KEY, { expiresIn: '1d' });

    return res.status(200).json({
      status: true,
      msg: "Login successful",
      token,
      // staticPath:'https://back-end-civil.onrender.com/',
      data: {
        id: isValidAstro._id,
        astroName: isValidAstro.astroName,
        email: isValidAstro.email,
        mobile: isValidAstro.mobile,
        profileimg:isValidAstro.profileImg
      }
    });

  } catch (error) {
    return res.status(500).json({ status: false, msg: "Something went wrong please try sometime" })
  }

}


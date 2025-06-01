require('dotenv').config();

const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const astroSchema = require('../../modal/astrologer/index')
const bodyParser = require('body-parser');
const fs = require('fs')
const path = require('path');
const { default: axios } = require('axios');
var validatorEmail=require('email-validator');


const deleteFileIfExists = (filepath) => {
  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath);
  }
};


// astrologer register
exports.registerAstrologer = async (req, res) => {
  const { astroName, astroDob, mobile, email, password, city, experience, expertise, langauge, shortBio, chargePerSession, availableTime, bankDetails } = req.body;

  // const astroEmail = email.toLowerCase();

  const profilePic = req.files?.profileimg?.[0]?.filename || null;
  const govDoc = req.files?.govDoc?.[0]?.filename || null


  const isValidEmailAddress=validatorEmail.validate(email)
    
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

    // check email valid
    // const isValidEmailAddress=validatorEmail.validate(email)
    // console.log(isValidEmailAddress)

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

    // send email when astrologer sucessfully register

    if (astroResponse) {
      const transporter = await nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        requireTLS: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
      });
      
      // Send email
      const mailsend = await transporter.sendMail({
        from: process.env.EMAIL_USER, // sender address
        to: `${email}`, // list of receivers
        subject: "Astro Truth", // Subject line
        text: ` `, // plain text body
        html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; padding: 30px;">
                          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
                              <div style="background-color: #4CAF50; padding: 20px; text-align: center;">
                              <h2 style="color: white; margin: 0;">Welcome to Astro Truth</h2>
                              </div>
                              <div style="padding: 30px;">
                              <p>Dear ${astroName || 'User'},</p>
                              <p>🎉 We're excited to let you know that your registration was <strong>successfully completed</strong>!</p>
                              <p>You can now log in and start using all our features and services.</p>
                              <p> ID : ${email} </p>
                              <p> Password : ${password} </p>          
                              <div style="text-align: center; margin: 30px 0;">
                                  <a href="https://astrotalkproject.vercel.app/login" style="background-color: #4CAF50; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Login to Your Account</a>
                              </div>
                                          
                              <p>If you have any questions or need support, feel free to contact our team at <a href="mailto:support@astrotruth.com">support@astrotruth.com</a>.</p>
                              <p>Thank you for joining us!<br>The Astro Truth Team</p>
                              </div>
                              <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #777;">
                              © ${new Date().getFullYear()} Your Company. All rights reserved.
                              </div>
                          </div>
                          </div>`, // html body
      });

      if (mailsend) {
        return res.status(200).json({ status: true, msg: `Registration completed successfully.` });
      }
    }

    // if (astroResponse) {
    //   return res.status(200).json({ status: true, msg: `Registration completed successfully.` });
    // }
  } catch (error) {
    console.error("Registration error:", error);
    if (profileImg) deleteFileIfExists(`upload/${profileImg}`);
    if (govDoc) deleteFileIfExists(`upload/${govDoc}`);
    if (error?.errorResponse?.keyPattern?.email) {
      return res.status(409).json({ status: 0, msg: 'Email already exists. Please try another email.' });
    }

    return res.status(500).json({ status: 0, msg: 'Registration failed. Something went wrong.', error: error.message });
  }
  // res.send("don");
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
        profileimg: isValidAstro.profileImg
      }
    });

  } catch (error) {
    return res.status(500).json({ status: false, msg: "Something went wrong please try sometime" })
  }

}

// login with mobile no
// exports.loginWithMobile = async (req, res) => {
//   try {
//     const { mobileNo } = req.body;

//     // Check if mobile number exists
//     const isValidMobileNo = await astroSchema.findOne({ mobile: mobileNo }, { password: 0 });
//     if (!isValidMobileNo) {
//       return res.status(404).json({ status: false, msg: "Mobile number not registered. Please try another." });
//     }

//     // Generate 4-digit OTP
//     const generatedOtp = Math.floor(1000 + Math.random() * 9000);
//     console.log("Generated OTP:", generatedOtp);

//     // Send OTP via Fast2SMS
//     var settings = {
//   "async": true,
//   "crossDomain": true,
//   "url": "https://www.fast2sms.com/dev/wallet",
//   "method": "POST",
//   "headers": {
//     "authorization": "sKC1qopRKeMP8vxfU4d2dDrKharP7jNpozYuzY4OqTv5f85tC4OGVmGZvrdH"
//   }
// }

// $.ajax(settings).done(function (response) {
//   console.log(response);
// });

//   } catch (error) {
//     console.error("Error sending OTP:", error.message);
//     res.status(500).json({ status: false, msg: "Internal server error" });
//   }

// }

exports.loginWithMobile = async (req, res) => {
  try {
    const { mobileNo } = req.body;

    // Validate mobile number in DB
    const isValidMobileNo = await astroSchema.findOne({ mobile: mobileNo }, { password: 0 });
    if (!isValidMobileNo) {
      return res.status(404).json({ status: false, msg: "Mobile number not registered. Please try another." });
    }

    // Generate 4-digit OTP
    const generatedOtp = Math.floor(1000 + Math.random() * 9000);

    // Send OTP using Fast2SMS
    const response = await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        variables_values: generatedOtp,
        route: "otp",
        numbers: mobileNo
      },
      {
        headers: {
          authorization: "sKC1qopRKeMP8vxfU4d2dDrKharP7jNpozYuzY4OqTv5f85tC4OGVmGZvrdH",
          "Content-Type": "application/json"
        }
      }
    );

    if (response.data.return === true) {
      return res.status(200).json({
        status: true,
        msg: "OTP sent successfully",
        otp: generatedOtp, // ⚠️ remove in production
        data: isValidMobileNo
      });
    } else {
      return res.status(500).json({ status: false, msg: "Failed to send OTP", detail: response.data });
    }

  } catch (error) {
    console.error("Error in loginWithMobile:", error.response?.data || error.message);
    res.status(500).json({
      status: false,
      msg: "Internal server error",
      error: error.response?.data || error.message
    });
  }
};

// astrologer list
exports.astrolist = async (req, res) => {
  try {
    const astroList = await astroSchema.find({}, { password: 0 });
    if (!astroList) return res.status(404).json({ status: false, msg: "Astrologer not Available !" })
    return res.status(200).json({ status: true, data: astroList })
  } catch (error) {
    return res.status(500).json({ status: false, msg: "Something went wrong please try sometime" });
  }
}




// astrologer call
// const io=require('../../../index');
// const astrologerSocketMap = {};
// exports.astroCall=async(req,res)=>{
//   try {
//     const { userId, astrologerId } = req.body;
//     const channelName="call_user123_astro456";

//     if (!userId || !astrologerId || !channelName) {
//       return res.status(400).json({ success: false, msg: "Missing required fields" });
//     }

//     const astrologerSocketId = astrologerSocketMap[astrologerId];
//     if (!astrologerSocketId) {
//       return res.status(404).json({ success: false, msg: "Astrologer is not online" });
//     }

//     // Example Agora token generation (pseudo-code, replace with real token logic)
//     const agoraToken = "dummy_agora_token_" + channelName;

//     // Emit call request to astrologer's socket
//     io.to(astrologerSocketId).emit("incoming-call", {
//       fromUserId: userId,
//       channelName,
//       token: agoraToken,
//     });

//     return res.status(200).json({
//       success: true,
//       msg: "Call initiated successfully",
//       data: {
//         to: astrologerId,
//         token: agoraToken,
//         channelName,
//       }
//     });

//   } catch (err) {
//     console.error("astroCall error:", err.message);
//     return res.status(500).json({ success: false, msg: "Server error" });
//   }

// }
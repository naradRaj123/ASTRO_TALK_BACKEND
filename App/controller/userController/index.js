// user modal
const userModal = require('../../modal/user/index')
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {sendOTPEmail}=require('../../../utils/sendMail')


// user register function
exports.userRegister = async (req, res) => {
    const { name, email, password, mobile } = req.body;
    const user_email = email.toLowerCase()

    try {
        // Check if email already exists
        const userExists = await userModal.findOne({ email });
        if (userExists) {
            return res.status(409).json({ status: 0, msg: 'Email already exists. Please try another email.' });
        }

        // Hash password
        const saltRounds = 10;
        const hashPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
        let userData = new userModal({
            user_name: name,
            user_phone: mobile,
            email: email,
            password: hashPassword
        });

        const userResponse = await userData.save();
        if (userResponse) {
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
                to: `${user_email}`, // list of receivers
                subject: "Astro Truth", // Subject line
                text: ` `, // plain text body
                html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; padding: 30px;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
                        <div style="background-color: #4CAF50; padding: 20px; text-align: center;">
                        <h2 style="color: white; margin: 0;">Welcome to Astro Truth</h2>
                        </div>
                        <div style="padding: 30px;">
                        <p>Dear ${name || 'User'},</p>
                        <p>🎉 We're excited to let you know that your registration was <strong>successfully completed</strong>!</p>
                        <p>You can now log in and start using all our features and services.</p>
                        <p> ID : ${user_email} </p>
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
        // Setup nodemailer


        // return res.status(200).json({ status: 1, msg: "Register successful" });

    } catch (error) {
        console.error("Registration error:", error);

        if (error?.errorResponse?.keyPattern?.email) {
            return res.status(409).json({ status: 0, msg: 'Email already exists. Please try another email.' });
        }

        return res.status(500).json({ status: 0, msg: 'Registration failed. Something went wrong.', error: error.message });
    }
};


// user login function
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email) {
        return res.status(400).json({ status: 0, msg: "Email is required" });
    }
    if (!password) {
        return res.status(400).json({ status: 0, msg: "Password is required" });
    }

    try {
        // Check if user exists
        const userData = await userModal.findOne({ email });
        if (!userData) {
            return res.status(404).json({ status: 0, msg: "User not found" });
        }

        if(!userData.status) return res.status(403).json({ status: 0, msg: "Your account is deactivated. Please contact support." })

        // Compare password
        const isMatch = await bcrypt.compare(password, userData.password);
        if (!isMatch) {
            return res.status(401).json({ status: 0, msg: "Incorrect password" });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: userData._id },
            process.env.JWT_TOKEN_KEY,
            { expiresIn: '1d' } // Optional: set token expiration
        );

        // Send response
        return res.status(200).json({
            status: true,
            msg: "Login successful",
            user: userData,
            token
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            status: 0,
            msg: "Something went wrong. Please try again later."
        });
    }
};

// user data by id
exports.UserInfoById = async (req, res) => {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
            status: false,
            msg: "Invalid user ID.",
        });
    }
    try {
        const userData = await userModal.findById({ _id: userId })
        if (!userData) {
            return res.status(404).json({ status: false, msg: "user not found. please check the id.", });
        }
        return res.status(200).json({ status: 1, userData });
    } catch (error) {
        if (error?.kind === 'ObjectId') {
            return res.status(400).json({ status: false, msg: "Invalid user ID. Please check the ID.", });
        }
        // Handle generic server error
        return res.status(500).json({ status: false, msg: "An unexpected error occurred. Please try again later.", });
    }
}

// user edit by id

exports.EditByUserId = async (req, res) => {
    const { user_id, user_name, user_email, user_phone, password,user_dob } = req.body;

    if (!mongoose.Types.ObjectId.isValid(user_id)) {
        return res.status(400).json({
            status: false,
            msg: "Invalid user ID.",
        });
    }

    // Get user details by ID
    const getUserData = await userModal.find({ _id: user_id });
    if (!getUserData || getUserData.length === 0) {
        return res.status(404).json({ status: false, msg: "User not found" });
    }
    // console.log(getUserData);
    const userObjData = getUserData[0].toObject();

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        requireTLS: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
    });

    try {
        const updateData = {};
        if (user_name) updateData.user_name = user_name;
        if (user_email) updateData.email = user_email;
        if (user_phone) updateData.user_phone = user_phone;
        if (password) updateData.password = password;
        if (user_dob) updateData.dob = user_dob;
        if (req.file) updateData.user_img = req.file.filename

        const result = await userModal.updateOne(
            { _id: user_id },
            { $set: updateData }
        );

        // console.log(result);

        if (result.modifiedCount > 0) {
            // ✅ Send success email
            await transporter.sendMail({
    from: 'infoastrotruth@gmail.com',
    to: user_email || userObjData.email,
    subject: "✅ Profile Updated Successfully",
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; max-width: 600px; margin: auto; }
        h2 { color: #4CAF50; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>✅ Profile Update Successful</h2>
        <p>Hi <strong>${user_name || userObjData.user_name}</strong>,</p>
        <p>Your profile has been updated successfully on <strong>AstroTruth</strong>.</p>
        <p>If you did not make this change, please contact our support team immediately.</p>
        <p>Thank you for being with us.</p>
        <br>
        <p>Warm regards,</p>
        <p><strong>AstroTruth Team</strong></p>
      </div>
    </body>
    </html>
    `
});


            return res.status(200).json({ status:true, msg: "Update Successfully" });
        } else {
            // ❌ Send failed update email
            await transporter.sendMail({
                from: 'infoastrotruth@gmail.com',
                to: user_email || userObjData.email,
                subject: "⚠️ Profile Update Failed",
                html: `<p>Hello ${user_name || userObjData.user_name},</p>
                       <p>We tried to update your profile, but nothing was changed.</p>`
            });

            return res.status(500).json({ status: false, msg: "Update Failed" });
        }
    } catch (error) {
        console.error(error);

        // ❌ Handle unexpected error and notify user
        await transporter.sendMail({
            from: 'infoastrotruth@gmail.com',
            to: user_email || userObjData.email,
            subject: "❗ Error During Profile Update",
            html: `<p>Hello,</p>
                   <p>There was an error while updating your profile: ${error.message}</p>`
        });

        return res.status(500).json({ status: false, msg: "Internal Server Error" });
    }
};

// userlist 
exports.Userlist=async(req,res)=>{
     try {
        const userList = await userModal.find({}, { password: 0 });
        if (!userList) return res.status(404).json({ status: false, msg: "users not Available !" })
        return res.status(200).json({ status: true, data: userList })
      } catch (error) {
        return res.status(500).json({ status: false, msg: "Something went wrong please try sometime" });
      }
}


// user update status by id (admin)
exports.UpdateStatus = async (req, res) => {
    try {
        const { userId } = req.body;
        // check id formate
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ status: false, msg: "Invalid user ID format" });
        }

        const userData = await userModal.findById({ _id: userId });
        // user match
        if (!userData) return res.status(409).json({ status: false, msg: "User not found" });
        
        // updae
        userData.status = !userData.status;
        await userData.save();
       return res.status(200).json({ status: true, msg: `User status updated to ${userData.status ? 'Active' : 'Deactive'}` });

    } catch (error) {
        return res.status(500).json({ status: false, msg: "Something Went to wrong try something" });
    }



}

//******* */ user auth changes apis (forgot) *********//

// send otp
exports.sendOtpOfUsers= async (req,res)=>{
      try {
    const { email } = req.body;

    const users = await userModal.findOne({ email });
    if (!users) {
      return res.status(404).json({ status: false, msg: 'Email not found' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    users.otp = {
      code: otp,
      expiresAt
    };

    await users.save();

    await sendOTPEmail(email, otp);
    res.status(200).json({ status: true, msg: 'A verification code has been sent to your email. It will expire in 10 minutes. ' });

  } catch (error) {
    console.error('SendOTPByEmail error:', error);
    res.status(500).json({ status: false, msg: 'Server error', error: error.message });
  }
}

// verify otp
exports.verifyOtpUser= async (req,res)=>{
    const { email, otp } = req.body;

  const users = await userModal.findOne({ email });
  if (!users || !users.otp) {
    return res.status(400).json({ status: false, msg: 'OTP not found or expired' });
  }

  const isExpired = new Date(users.otp.expiresAt) < new Date();
  const isMatch = users.otp.code == otp;
  console.log(isMatch)
  if (!isMatch || isExpired) {
    return res.status(400).json({ status: false, msg: 'Invalid or expired OTP' });
  }

  users.otp.verified = true;
  await users.save();

  res.status(200).json({ status: true, msg: 'OTP verified successfully' });
}

// reset password
exports.resetPasswordUser=async(req,res)=>{
     const { email, newPassword } = req.body;

  const users = await userModal.findOne({ email });
  if (!users || !users.otp || !users.otp.verified) {
    return res.status(400).json({ status: false, msg: 'OTP not verified or expired' });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  users.password = hashedPassword;

  // Clear OTP
  users.otp = undefined;
  await users.save();

  return res.status(200).json({ status: true, msg: 'Password reset successfully' });
}


// user modal
const userModal = require('../../modal/user/index')
const nodemailer = require('nodemailer');

const bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken');

// user register function
exports.userRegister = async (req, res) => {
    const { name, email, password, phone } = req.body;
    const user_email=email.toLowerCase()

    try {
        // Check if email already exists
        const userExists = await userModal.findOne({ user_email });
        if (userExists) {
            return res.status(409).json({ status: 0, msg: 'Email already exists. Please try another email.' });
        }

        // Hash password
        const saltRounds = 10;
        const hashPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
        let userData = new userModal({
            user_name: name,
            user_phone: phone,
            user_email,
            password: hashPassword
        });

        const userResponse = await userData.save();
        if (userResponse) {
            const transporter =await nodemailer.createTransport({
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
            const mailsend =await transporter.sendMail({
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
//const twilio = require("twilio");
const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model'); // Adjust the path according to your project structure
//const { Stripe } = require("stripe");
const router = express.Router();

//const stripeKey = process.env.STRIPE_SECRET_KEY;
//const stripe = new Stripe(stripeKey);

const transporter = nodemailer.createTransport({
    service : "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "ridex2026@gmail.com",
      pass: "jnmtplziaftoczfm"
    },
    tls: {
        rejectUnauthorized: false, // ✅ Fixes the self-signed certificate issue
    }
  })


// Middleware for authentication
const authenticate = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Access denied' });
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};

router.get('/getById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters
    console.log(id);
    try {
        const user = await User.findById({ _id: id });
        //console.log(user);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving User', error });
    }
});

router.get('/getForSecurity/:id/:security_code', async (req, res) => {
    const { id, security_code } = req.params; // Get the ID from the request parameters
    
    console.log(req.params);
    console.log(id);
    try {
        console.log("Hello");
        const user = await User.findById({ _id: id });
        console.log(user);
        if (!user) {
            return res.status(403).json({ message: 'User not found' });
        }
        if (user.security_code !== security_code) {
            return res.status(401).json({ message: 'Security code mismatch' });
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving User', error });
    }
});

router.get('/getByEmail/:email', async (req, res) => {
    const { email } = req.params; // Get the ID from the request parameters
    try {
        const user = await User.findOne({ email });
        //console.log(user);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving User', error });
    }
});

// Register By Email
router.post('/register', async (req, res) => {
    try {
        let user = {};
        const { email, isTaxExempt } = req.body;
        const status = 'Active';  
        console.log(isTaxExempt);
        const userInfo = await User.findOne({email: email});
        const specialPassword = generatePassword();
        const emailTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">    
            <h2 style="text-align: center; color: #333;">WELCOME TO <span style="color: #007BFF;">TRUDOOR.COM</span></h2>
            
            <p>Hi <strong>${email}</strong>,</p>
            
            <p>Thanks for creating an account on Trudoor. Your username is <strong>${email}</strong>. 
            You can access your account area to view orders, change your password, and more at:</p>
            
            <p style="text-align: center;">
                <a href="https://www.trudoor.com/my-account/" style="color: #007BFF; font-weight: bold;">https://www.trudoor.com/my-account/</a>
            </p>    
            <p>Your password has been automatically generated: <strong style="color: #000; font-size: 18px;">${specialPassword}</strong></p>
            <p>We look forward to seeing you soon.</p>
            <hr>
        </div>`;
        console.log("User data", userInfo);
    
        if (!userInfo){
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(specialPassword, saltRounds);
            user = new User( {email: email, password: hashedPassword,isTaxExempt: isTaxExempt, status: status} );
            await user.save();

            const emailOptions = {
                from: "ridex2026@gmail.com", //process.env.EMAIL_USER,
                to: email,
                /*to: process.env.EMAIL_USER,*/
                subject: "🚀 Your trudoor.com account has been created",
                //Subject: "🚀 Welcome to Trudoor - Your Account is Ready!",
                //html: `Your verification code is: "${random}".`,
                //html: `Thanks for creating an account on Trudoor. Your password has been automatically generated: ` + specialPassword,
                html: emailTemplate,
              };       
              await transporter.sendMail(emailOptions, (error, info) => {
                if (error) {
                    console.log('Error====', error);
                } else {
                    //console.log('Message sent: %s', info.messageId);
                }
              });

            res.status(200).json({ message: 'User created successfully' });
        } else {
            res.status(400).json({ message: 'User already exist' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Error creating Company', error });
    }
});


// Lost password
router.post('/lost_password', async (req, res) => {
    try {
        let user = {};
        const { email } = req.body;
        const userInfo = await User.findOne({email: email});
        console.log(req.body);
        const saltRounds = 10;
        const resetCodeTemp = generatePassword();
        const resetCode = await bcrypt.hash(resetCodeTemp, saltRounds);
        const finalResetCode = resetCode.replace(/\//g, '_').replace(/\$/g, '-');
        //console.log(resetCode);
        const resetLink = "http://localhost:59425/user_verification/?key="+finalResetCode+"&id="+userInfo._id;
        const emailTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
            <h2 style="text-align: center; color: #333;">PASSWORD RESET REQUEST</h2>
            <p>Hi <strong>${userInfo.display_name}</strong>,</p>
            <p>Someone has requested a new password for the following account on Trudoor:</p>
            <p><strong>Username: ${userInfo.display_name}</strong></p>    
            <p>If you didn't make this request, just ignore this email. If you'd like to proceed:</p>
            <p style="text-align: center;">
                <a href="${resetLink}" style="color: #D35400; font-weight: bold; text-decoration: none;">Click here to reset your password</a>
            </p>
            <p>Thanks for reading.</p>
    
            <hr>
    
            <p style="text-align: center; font-size: 12px; color: #666;">
                Trudoor LLC | Phoenix, AZ <br>
                If you have any questions, please contact us at <a href="mailto:support@trudoor.com" style="color: #D35400;">support@trudoor.com</a> | 1-844-TRUDOOR (878-3667) ext. 500
            </p>
        </div>`;

        if (userInfo){
            //console.log("User found", finalResetCode);
            const user = await User.findByIdAndUpdate( userInfo._id,
                { 
                    security_code: finalResetCode,
                    updatedAt: Date.now() },
                { new: true, runValidators: true }
            );
            //console.log(user);
            //console.log("Record Update");
            const emailOptions = {
                from: '"Amidoor Support" <ridex2026@gmail.com>', //process.env.EMAIL_USER,
                to: email,
                /*to: process.env.EMAIL_USER,*/
                subject: "🔒 Password Reset Request",
                //Subject: "🚀 Welcome to Trudoor - Your Account is Ready!",
                //html: `Your verification code is: "${random}".`,
                //html: `Thanks for creating an account on Trudoor. Your password has been automatically generated: ` + specialPassword,
                html: emailTemplate,
              };       
              await transporter.sendMail(emailOptions, (error, info) => {
                if (error) {
                    console.log('Error====', error);
                } else {
                    //console.log('Message sent: %s', info.messageId);
                }
              });
            res.status(200).json({ message: 'Email send successfully' });
        } else {
            res.status(400).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Error finding user', error });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        let userData, token;
        console.log(req.body);
        const { userEmail, userPassword } = req.body;
        console.log(userEmail);
        const user = await User.findOne({ email: userEmail });
        console.log("User Exist or Not: ",user);
        if (!user) {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(userPassword, saltRounds);
            const newUser = new User( {email: userEmail, password: hashedPassword, status: 'Active'} );
            await newUser.save();
            userData = newUser;
            //const { password, ...userData } = newUser; // Exclude password from the response
        } else {            
            const isMatch = await bcrypt.compare(userPassword, user.password);
            console.log("password match", isMatch);
            if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });
            //token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            userData = user;
            //const { password, ...userData } = user; // Exclude password from the response
            console.log(userData);
        }
        //console.log("User",userData);
        token = jwt.sign({ id: userData._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const { password, ...userDataFinal } = userData.toObject(); // Exclude password from the response
        res.json({ user: userDataFinal, token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});

router.post('/update_user_info', async (req, res) => {
    const { firstName, lastName, displayName, mobileNo, userEmail, oldPassword, newPassword } = req.body;
    try {
        const userInfo = await User.findOne({ email: userEmail });
        if (!userInfo) {
            return res.status(404).json({ message: 'User not found' });
        }
        const user = await User.findByIdAndUpdate( userInfo._id,
            { 
                first_name: firstName,
                last_name: lastName,
                display_name: displayName,
                mobile_no: mobileNo,
                updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        console.log("Old Password",oldPassword);
        if(oldPassword && newPassword){
            const isMatch = await bcrypt.compare(oldPassword, userInfo.password);
            //if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });            
            if (isMatch){
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(newPassword, saltRounds);                
                const userPass = await User.findByIdAndUpdate( userInfo._id,
                    { 
                        password: hashedPassword
                    },
                    { new: true, runValidators: true }
                );                
            }
        }
//        const token = createToken(userInfo._id, userInfo.mobile_no);
        //console.log(driver);
        // If verification succeeds, return success
        //, userData: user
        res.status(200).json({ success: true, message: 'User info updated successfully' });
    } catch (error) {
        console.error('Error update password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/reset_password', async (req, res) => {
    const { id, newPassword } = req.body;
    try {
        const userInfo = await User.findById({ _id: id });
        if (!userInfo) {
            return res.status(404).json({ message: 'User not found' });
        }
        const user = await User.findByIdAndUpdate( userInfo._id,
            { 
                password: hashedPassword,
                updatedAt: Date.now() },
            { new: true, runValidators: true }
        );
        res.status(200).json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error update password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.post('/user_payment', async (req, res) => {
    const { amount, currency } = req.body;
    //console.log("Payment Body", amount);
    //console.log("Payment Req", currency);
    try{
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: currency,
        });
        //console.log("Payment Intent", paymentIntent)
        if (paymentIntent?.status != 'completed') {
            //console.log('===== in');
            return res.status(200).json({
                message: 'Confirm payment please',
                client_secret: paymentIntent?.client_secret,
            });
        }
        return res.status(200).json({ message: 'Payment Completed Successfully'});

    } catch (error) {
        res.status(400).json({ message: 'Error user payment', error });
    } 

});




router.post('/create_password', async (req, res) => {
    const { mobile_no, password } = req.body;
    //console.log(req.body);
    // Check if all fields are provided
    if (!mobile_no || password === undefined) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Find the driver using mobile_no and company_id
        const userInfo = await User.findOne({ mobile_no });
        //console.log(driverInfo);
        if (!userInfo) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (userInfo.is_verified == false){
            return res.status(404).json({ message: 'User not verified' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = await User.findByIdAndUpdate( userInfo._id,
            { password: hashedPassword, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        // If verification succeeds, return success
        res.status(200).json({ success: true, message: 'Password created successfully' });
    } catch (error) {
        console.error('Error update password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/verify_password', async (req, res) => {
    const { mobile_no, password } = req.body;

    // Check if all fields are provided
    if (!mobile_no || password === undefined) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const userInfo = await User.findOne({ mobile_no, is_verified: true, status: 'Active' });
        //console.log(driverInfo);
        if (!userInfo) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, userInfo.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = createToken(userInfo._id, userInfo.mobile_no);

        res.status(200).json({ success: true, message: 'Security code verified successfully', userData: userInfo, token: token });
    } catch (error) {
        console.error('Error verifying security code:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Generate Code
router.put('/generate_code', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid email or password' });

        var randonCode = randomValueHex(9);
        var codeExpiry = new Date(Date.now() + 2 * 60 * 1000); // Adds 2 minutes

        const updatedUser = await User.findByIdAndUpdate(user._id, { gen_code: randonCode, code_expiry: codeExpiry }, { new: true });
        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: 'Error updating user', error });
    }
});

// Reset Password
router.put('/reset_password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid email or password' });

        var randonCode = randomValueHex(9);
        var codeExpiry = new Date(Date.now() + 2 * 60 * 1000); // Adds 2 minutes

        const updatedUser = await User.findByIdAndUpdate(user._id, { gen_code: randonCode, code_expiry: codeExpiry }, { new: true });
        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: 'Error updating user', error });
    }
});

// Update User
router.put('/update', async (req, res) => {
    const { mobile_no, user_name, mobile_code } = req.body;
    try {
        const user = await User.findOne({ mobile_no });
        if (!user) return res.status(400).json({ message: 'User not found' });
        let updatedUser = "";
        if (user_name != null){
            updatedUser = await User.findByIdAndUpdate(user._id, { user_name }, { new: true });
        } else if (user_category != null){
            if (user_category == "Driver"){
                updatedUser = await User.findByIdAndUpdate(user._id, { user_category, company_id }, { new: true });
            } else {
                updatedUser = await User.findByIdAndUpdate(user._id, { user_category }, { new: true });
            }
        }
        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: 'Error updating user', error });
    }
});

function randomValueHex (len) {
    return crypto.randomBytes(Math.ceil(len/2))
        .toString('hex') // convert to hexadecimal format
        .slice(0,len).toUpperCase();   // return required number of characters
}

function generateSixDigitNumber() {
    return Math.floor(100000 + Math.random() * 900000);
}

function generatePassword(length = 16) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|<>?';
    return Array.from(crypto.randomFillSync(new Uint8Array(length)))
        .map(byte => chars[byte % chars.length])
        .join('');
}

function  createToken(userId, mobileNo, companyId) {
    const SECRET_KEY = process.env.SECRET_KEY;
    return jwt.sign(
        { id: userId, mobile_no: mobileNo, company_id: companyId },
        SECRET_KEY,
        { expiresIn: '1h' } // Token expires in 1 hour
    );
}
/*
async function createMessage(mobileNo, code ) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(accountSid, authToken);


    const message = await client.messages.create({
      body: "Thank you choosing to RideX. Your OTP is "+ code +". Dont share this code with any one.",
      from: "whatsapp:+14155238886",
      to: `whatsapp:${mobileNo}`,
    });
    return message.sid;
    //console.log(message.body);
  }
*/
module.exports = router;

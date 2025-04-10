const twilio = require("twilio");
const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const QuotationUser = require('../models/quotation_user.model');
const QuotationMaster = require('../models/user_quotation_master.model');
const QuotationUserLog = require('../models/quotation_user_log.model');
const router = express.Router();


router.get('/getById/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters
    console.log(id);
    try {
        const user = await QuotationUser.findById({ _id: id });
        console.log(user);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Company', error });
    }
});

router.get('/getByEmail/:email', async (req, res) => {
    const { email } = req.params; // Get the ID from the request parameters
    try {
        const user = await QuotationUser.findOne({ email });
        //console.log(user);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving Company', error });
    }
});

// Register By Email
router.post('/create_user', async (req, res) => {
    try {
        let user = {};
        const { full_name,email, company,mobile_no, zip_code, address, shipping_method } = req.body;
        const userInfo = await QuotationUser.findOne({email: email});

        if (!userInfo){
            user = new QuotationUser( {full_name,email, company,mobile_no, zip_code, address, shipping_method} );
            await user.save();
        } else {
            userLog = new QuotationUserLog({
                quot_user_id: userInfo._id,
                full_name: userInfo.full_name,
                email: userInfo.email,
                company: userInfo.company,
                mobile_no: userInfo.mobile_no,
                zip_code: userInfo.zip_code,
                address: userInfo.address,
                shipping_method: userInfo.shipping_method,
            });
            await userLog.save();
            user = await QuotationUser.findByIdAndUpdate( userInfo._id,
                { 
                    first_name: full_name,
                    email: email,
                    company: company,
                    mobile_no: mobile_no,
                    zip_code: zip_code,
                    address: address,
                    shipping_method: shipping_method,
                    updatedAt: Date.now() },
                { new: true, runValidators: true }
            );            
        }
        res.status(200).json({ user: user});
    } catch (error) {
        res.status(400).json({ message: 'Error creating Company', error });
    }
});

router.post("/send-email", async (req, res) => {
    const {
      full_name,
      email,
      company,
      mobile_no,
      zip_code,
      address,
      shipping_method,
      quantity,
      note,
      quotation_for,
      userJourneyDetails,
    } = req.body;
  
    if (!full_name || !email || !company || !mobile_no || !zip_code || !address || !shipping_method || !userJourneyDetails) {
      return res.status(400).json({ error: "All fields are required." });
    }
    console.log(userJourneyDetails);
    try {
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
      });
  
/*      const htmlDetails = userJourneyDetails.map(
        (step) => `<p><strong>${step.title}</strong>: ${step.value || "N/A"}</p>`
      ).join("");*/
  
      const htmlDetails = userJourneyDetails.map(item => {
        const label = item.label || 'Unknown';
        const value = item.value || '';
        const price = item.price || 0;
        return `<p><strong>${label}:</strong> ${value}${price > 0 ? ` <strong>Price:</strong> ${price}` : ''}</p>`;
      }).join('');

      const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #f9f9f9; padding: 24px; border-radius: 8px; border: 1px solid #e0e0e0;">
        <h2 style="color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 8px; margin-bottom: 24px;">
          📦 New Quote Request
        </h2>
    
        <table style="width: 100%; font-size: 14px; line-height: 1.6; border-collapse: collapse;">
          <tr>
            <td style="width: 120px; font-weight: bold;">Name:</td>
            <td>${full_name}</td>
            <td style="width: 120px; font-weight: bold;">Email:</td>
            <td>${email}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Company:</td>
            <td>${company}</td>
            <td style="font-weight: bold;">Phone:</td>
            <td>${mobile_no}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Quantity:</td>
            <td>${quantity}</td>
            <td style="font-weight: bold;">ZIP Code:</td>
            <td>${zip_code}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Address:</td>
            <td colspan="3">${address}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Note:</td>
            <td>${note || "-"}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Delivery Option:</td>
            <td>${shipping_method}</td>
          </tr>
        </table>
    
        <h3 style="margin-top: 32px; color: #4CAF50;">📋 Selected Product Details</h3>
        <div style="background: #fff; border: 1px solid #ddd; padding: 16px; border-radius: 6px; margin-top: 10px;">
        <div style="font-size: 20px; margin-bottom: 12px; font-weight: bold;">
            Quotation for ${quotation_for}
        </div>
          ${htmlDetails}
        </div>
    
        <p style="margin-top: 30px; font-size: 12px; color: #999; text-align: center;">
          This email was generated from a quote request submission.
        </p>
      </div>
    `;
      
      await transporter.sendMail({
        from: "your-email@gmail.com",
        //to: "mshahzebkhan2k@gmail.com",
        to: "kashi.aquarius@gmail.com",
        subject: "New Quote Request",
        html,
      });
  
      res.json({ success: true, message: "Email sent successfully" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ success: false, message: "Failed to send email" });
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



module.exports = router;

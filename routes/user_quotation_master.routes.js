const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const axios = require("axios");
const nodemailer = require('nodemailer');
const { ObjectId } = require('mongodb');
const UserQuotationMaster = require('../models/user_quotation_master.model');
const UserQuotationDetail = require('../models/user_quotation_detail.model');
const QuotationUser = require('../models/quotation_user.model');
const router = express.Router();

/*
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
});*/

router.get("/quotation-details/:id", async (req, res) => {
  try {
    const quotationMasterId = req.params.id;
    const data = await getQuotationDetails(quotationMasterId);

    if (!data) {
      return res.status(404).json({ success: false, message: "Quotation not found" });
    }

    // Define PDF path
    const pdfFolderPath = path.join(__dirname, "../public/pdf");
    if (!fs.existsSync(pdfFolderPath)) fs.mkdirSync(pdfFolderPath, { recursive: true });

    const pdfFilePath = path.join(pdfFolderPath, `quotation_${quotationMasterId}.pdf`);

    // Generate PDF
    //await generateQuotationPDF(data, pdfFilePath);
    await generatePDF(data, pdfFilePath);
    // Send email
    await sendEmailWithPDF(pdfFilePath);

    res.status(200).json({ success: true, message: "PDF generated and email sent successfully!" });
    //res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

const getQuotationDetails = async (quotationMasterId) => {
  try {
    const quotationData = await UserQuotationMaster.aggregate([
      {
        $match: { _id: new ObjectId(quotationMasterId) } // Match by _id
      },
      {
        $lookup: {
          from: "quotation_users",
          localField: "quotation_user_id",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      {
        $unwind: "$userDetails" // Convert array to object
      },
      {
        $lookup: {
          from: "user_quotation_details",
          let: { masterId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$quotation_master_id", "$$masterId"] } } },
            { $sort: { sequence_id: 1 } } // Sort by sequence_id in ascending order
          ],
          as: "quotationDetails"
        }
      },      
      /*{
        $lookup: {
          from: "user_quotation_details",
          localField: "_id",
          foreignField: "quotation_master_id",
          as: "quotationDetails"
        }
      },*/
      {
        $project: {
          _id: 1,
          title: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          userDetails: {
            full_name: 1,
            email: 1,
            company: 1,
            mobile_no: 1,
            zip_code: 1,
            address: 1,
            shipping_method: 1
          },
          quotationDetails: {
            sequence_id: 1,
            title: 1,
            value: 1,
            price: 1
          }
        }
      }
    ]);

    return quotationData.length > 0 ? quotationData[0] : null;
  } catch (error) {
    console.error("Error fetching quotation details:", error);
    throw error;
  }
};



// Function to send email with PDF attachment
const sendEmailWithPDF = async (filePath) => {
  try {
    let transporter = nodemailer.createTransport({
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

    let mailOptions = {
      from: "ridex2026@gmail.com",
      to: "kashi.aquarius@gmail.com",
      subject: "Quotation PDF",
      text: "Please find the attached quotation PDF.",
      attachments: [{ filename: "quotation.pdf", path: filePath }],
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

/*
async function generateQuotationPDF(data, filePath) {
  return new Promise((resolve, reject) => {
    // Create document with a margin
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    
    // 1) Draw a small black box with diagonal stripes at the top-left (optional)
    doc.save();
    const stripeBoxX = 50;
    const stripeBoxY = 50;
    const stripeBoxWidth = 300;
    const stripeBoxHeight = 60;

    // Fill black rectangle
    doc.rect(stripeBoxX, stripeBoxY, stripeBoxWidth, stripeBoxHeight).fill("#000");


    // 2) Yellow header bar with "QUOTATION"
    const headerBarY = 50;
    doc
      .save()
      .rect(110, headerBarY, doc.page.width - 160, 60) // Enough width to extend to the right margin
      .fill("#FBB03B") // or "#FFD25F" or any preferred yellow
      .restore();

    doc
      .fillColor("#000")
      .fontSize(20)
      .text("QUOTATION", 120, headerBarY + 15, { bold: true });

    // 3) "Quote No" and "Date" fields
    const topFieldsY = headerBarY + 80;
    doc
      .fontSize(10)
      .fillColor("#000")
      .text(`Quote No: ${data._id || ""}`, 50, topFieldsY)
      .text(`Date: ${new Date(data.createdAt).toLocaleDateString()}`, 300, topFieldsY);

    // 4) Bill To / Bill From
    const billSectionY = topFieldsY + 30;
    doc
      .fontSize(10)
      .text("Bill To:", 50, billSectionY, { bold: true })
      .moveDown(0.5)
      .fontSize(9)
      .text(data?.userDetails?.full_name || "")
      .text(data?.userDetails?.address || "")
      .text(data?.userDetails?.email || "");

    doc
      .fontSize(10)
      .text("Bill From:", 300, billSectionY, { bold: true })
      .moveDown(0.5)
      .fontSize(9)
      .text("Furniture Company Name")
      .text("Company Address")
      .text("Phone Number")
      .text("Email Address");

    // 5) "Custom Furniture Details" header
    let tableStartY = billSectionY + 60;
    doc
      .save()
      .rect(50, tableStartY, doc.page.width - 100, 20)
      .fill("#FBB03B")
      .restore();

    doc
      .fillColor("#000")
      .fontSize(10)
      .text("Custom Furniture Details", 55, tableStartY + 5, { bold: true });

    tableStartY += 30;

    // 6) Draw the table header
    const tableHeaders = [
      { label: "Category", width: 120 },
      { label: "Item", width: 180 },
      { label: "Unit Price", width: 70 },
      { label: "Quantity", width: 60 },
      { label: "Total Cost", width: 60 },
    ];

    let currentX = 50;
    const rowHeight = 20;

    doc.fontSize(9).fillColor("#000");
    tableHeaders.forEach((header) => {
      doc.text(header.label, currentX + 2, tableStartY + 5, {
        width: header.width,
        align: "left",
      });
      currentX += header.width;
    });

    // Draw a line below header
    doc
      .moveTo(50, tableStartY + rowHeight)
      .lineTo(50 + tableHeaders.reduce((acc, col) => acc + col.width, 0), tableStartY + rowHeight)
      .stroke();

    // 7) Table body (Items)
    let yPos = tableStartY + rowHeight;
    let subtotal = 0;

    // If your data is in data.quotationDetails
    data.quotationDetails.forEach((item, index) => {
      yPos += rowHeight;
      currentX = 50;

      // Calculate total cost for the row
      const quantity = item.quantity || 1;
      const unitPrice = item.unitPrice || item.price || 0;
      const totalCost = quantity * unitPrice;
      subtotal += totalCost;

      // Table cells
      const rowData = [
        item.title || "",            // Description
        item.value || "",            // 
        `$${unitPrice.toFixed(2)}`,  // Unit Price
        quantity.toString(),         // Quantity
        `$${totalCost.toFixed(2)}`,  // Total Cost
      ];

      tableHeaders.forEach((col, i) => {
        doc.text(rowData[i], currentX + 2, yPos + 5, {
          width: col.width,
          align: i === 4 || i === 6 ? "right" : "left", // Right-align prices
        });
        currentX += col.width;
      });

      // (Optional) If yPos goes near bottom, addPage + redraw table header
      if (yPos > doc.page.height - 100) {
        doc.addPage();
        yPos = 50;
        // Redraw table header here if needed
      }
    });

    // 8) Subtotal, taxes, additional charges, grand total
    yPos += rowHeight + 10;
    doc
      .moveTo(50, yPos)
      .lineTo(50 + tableHeaders.reduce((acc, col) => acc + col.width, 0), yPos)
      .stroke();

    yPos += 10;
    const leftColX = 300;
    const tax = subtotal * 0.05;
    const additionalCharges = 0; // or from data if you have it
    const grandTotal = subtotal + tax + additionalCharges;

    doc.fontSize(10);
    doc.text(`Subtotal: $${subtotal.toFixed(2)}`, leftColX, yPos, { align: "right" });
    yPos += 15;
    doc.text(`Taxes (if applicable): $${tax.toFixed(2)}`, leftColX, yPos, { align: "right" });
    yPos += 15;
    doc.text(`Additional Charges: $${additionalCharges.toFixed(2)}`, leftColX, yPos, {
      align: "right",
    });
    yPos += 15;
    doc.fontSize(11).text(`Grand Total: $${grandTotal.toFixed(2)}`, leftColX, yPos, {
      align: "right",
      bold: true,
    });

    // 9) Bottom Signature Section (yellow bar)
    const bottomBarY = doc.page.height - 100;
    doc
      .save()
      .rect(50, bottomBarY, doc.page.width - 100, 40)
      .fill("#FBB03B")
      .restore();

    // "Authorized Signature" and "Client Acceptance" placeholders
    doc
      .fillColor("#000")
      .fontSize(9)
      .text("Authorized Signature\n[Insert Name & Title]", 60, bottomBarY + 10, {
        width: 200,
        align: "left",
      });
    doc
      .text("Client Acceptance\n[Insert Name & Title]", doc.page.width - 250, bottomBarY + 10, {
        width: 200,
        align: "right",
      });

    // 10) End the document
    doc.end();
    stream.on("finish", () => resolve(filePath));
    stream.on("error", (err) => reject(err));
  });
}*/

/* first grid quotation
const generatePDF = async (data, filePath) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Company Info
    doc
      .fontSize(16)
      .text("Your Company Inc.", { bold: true })
      .moveDown(0.2)
      .fontSize(12)
      .text("1234 Company St,")
      .text("Company Town, ST 12345")
      .moveDown(1);

    // Quote Header
    doc
      .fontSize(24)
      .text("INTERIOR DESIGN QUOTE", { align: "right", bold: true })
      .moveDown(1);

    // Quote Details
    doc
      .fontSize(12)
      .text(`Quote #: ${data._id}`, { align: "right" })
      .text(`Quote Date: ${new Date(data.createdAt).toLocaleDateString()}`, { align: "right" })
      .text(`Due Date: ${new Date(data.createdAt).toLocaleDateString()}`, { align: "right" })
      .moveDown(2);

    // Bill To Section
    doc
      .fontSize(14)
      .text("Bill To", { bold: true })
      .moveDown(0.3)
      .fontSize(12)
      .text(data.userDetails.full_name)
      .text(data.userDetails.address)
      .text(`ZIP Code: ${data.userDetails.zip_code}`)
      .moveDown(1);

    // Table Headers (Without Unit Price)
    const startX = 50;
    let startY = doc.y;
    const colWidths = [50, 150, 250, 100]; // Adjusted width for 4 columns

    doc.fontSize(12).fillColor("black");
    const headers = ["QTY", "Category", "Item", "Amount"];
    
    headers.forEach((header, i) => {
      doc.text(header, startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0), startY, {
        bold: true,
        width: colWidths[i],
        align: "left",
      });
    });

    startY += 20;
    doc.moveTo(startX, startY).lineTo(550, startY).stroke(); // Draw line below header

    // Table Rows
    let subtotal = 0;
    data.quotationDetails.forEach((item) => {
      const quantity = 1;
      const amount = item.price || 0;
      subtotal += amount;

      startY += 25;
      
      // Draw Grid for Each Row
      doc.rect(startX, startY - 5, colWidths.reduce((a, b) => a + b, 0), 25).stroke();

      // Fill Table Data with Proper Column Alignment (Without Unit Price)
      doc.text(quantity.toString(), startX, startY, { width: colWidths[0], align: "left" });
      doc.text(item.title, startX + colWidths[0], startY, { width: colWidths[1], align: "left" });
      doc.text(item.value, startX + colWidths[0] + colWidths[1], startY, {
        width: colWidths[2],
        align: "left",
      });
      doc.text(`$${amount.toFixed(2)}`, startX + colWidths[0] + colWidths[1] + colWidths[2], startY, {
        width: colWidths[3],
        align: "right",
      });
    });

    startY += 30;
    doc.moveTo(startX, startY).lineTo(550, startY).stroke(); // Draw line below table

    // Subtotal, Tax, and Total
    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    doc
      .text(`Subtotal: $${subtotal.toFixed(2)}`, startX + 300, startY + 10, { align: "right" })
      .text(`Sales Tax (5%): $${tax.toFixed(2)}`, startX + 300, startY + 30, { align: "right" })
      .fontSize(14)
      .text(`Total (USD): $${total.toFixed(2)}`, startX + 300, startY + 50, { bold: true, align: "right" })
      .moveDown(2);

    // Terms and Conditions
    doc
      .fontSize(12)
      .text("Terms and Conditions", { bold: true })
      .moveDown(0.3)
      .text("Payment is due in 14 days.")
      .text("Please make checks payable to: Your Company Inc.")
      .moveDown(2);

    // Customer Signature Line
    doc
      .moveTo(50, doc.y)
      .lineTo(250, doc.y)
      .stroke()
      .text("customer signature", 50, doc.y + 5, { align: "left" })
      .moveDown(2);

    // Footer
    doc
      .fontSize(10)
      .text("This email was generated from a quote request submission.", { align: "center" });

    doc.end();

    stream.on("finish", () => resolve(filePath));
    stream.on("error", reject);
  });
}; */


const downloadImage = async (url, outputPath) => {
  const response = await axios({
    url,
    responseType: "arraybuffer",
  });
  fs.writeFileSync(outputPath, response.data);
};

const generatePDF = async (data, filePath) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Validate Data
      if (!data || !data.userDetails || !data.quotationDetails) {
        throw new Error("Invalid data structure");
      }

      // === ADD BLACK HEADER ===
      doc.rect(0, 0, doc.page.width, 100).fill("black"); // Black background bar

      // === DOWNLOAD AND ADD IMAGE ===
      const imageUrl = "https://amidoor.com/wp-content/uploads/2022/04/AMI_FullLogo-Horizontal-ColorReverse-RGB-500x235px-1.png";
      const imagePath = path.join(__dirname, "header_image.png"); // Local file path
      await downloadImage(imageUrl, imagePath);
      doc.image(imagePath, 50, 10, { width: 250, height: 100 }); // Adjusted image position

      doc.moveDown(6); // Add spacing after the header

      // Quote No & Date
      doc.fontSize(12)
        .text(`Quote No: ${data._id || "N/A"}`, { continued: true })
        .text(`Date: ${new Date().toLocaleDateString()}`, { align: "right" })
        .moveDown(1);

      // Bill To (Left) and Bill From (Right)
      doc.fontSize(12).fillColor("#FFA500").text("Bill To:", { continued: false });
      doc.moveUp();
      doc.text("Bill From:", { align: "right" });

      doc.fillColor("black");
      doc.text(`${data.userDetails.full_name || "N/A"}`, { continued: false });
      doc.moveUp();
      doc.text("AMI Doors", { align: "right" });

      doc.text(`${data.userDetails.address || "N/A"}`, { continued: false });
      doc.moveUp();
      doc.text("900 Beards Hill Road Aberdeen, Maryland 21001", { align: "right" });

      doc.text(`${data.userDetails.mobile_no || "N/A"}`, { continued: false });
      doc.moveUp();
      doc.text("410-638-9480 office", { align: "right" });

      doc.text(`${data.userDetails.email || "N/A"}`, { continued: false });
      doc.moveUp();
      doc.text("support@amidoor.com", { align: "right" });

      doc.moveDown(3);

      // Custom Furniture Details Table
      //doc.fontSize(14).text("Custom Furniture Details", { underline: true }).moveDown(0.5);
      doc.font("Helvetica-Bold")
        .fontSize(20)
        .text("Custom Furniture Details", { underline: true, align: "center" })
        .moveDown(0.5);

      doc.moveDown(2);

      if (!Array.isArray(data.quotationDetails) || data.quotationDetails.length === 0) {
        doc.fontSize(11).fillColor("red").text("No quotation details available.", { align: "center" });
      } else {
        // Table Headers
        const headers = ["Category", "Item", "Unit Price", "Quantity", "Total Cost"];
        const columnWidths = [100, 200, 70, 60, 80]; // Adjusted widths
        let startX = doc.x;
        let y = doc.y;

        doc.font("Helvetica-Bold").fontSize(13);
        headers.forEach((header, i) => {
          doc.text(header, startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), y, {
            width: columnWidths[i],
            align: "left",
          });
        });

        y += 20;
        doc.font("Helvetica").fontSize(11);

        // Draw Table Rows
        data.quotationDetails.forEach((item, index) => {
          if (!item) return; // Skip invalid items

          let unitPrice = item.price || 0; // Ensure price is valid
          let quantity = item.quantity || 1; // Default to 1 if quantity is missing
          let totalCost = unitPrice * quantity; // Correct multiplication

          doc.text(item.title || "N/A", startX, y, { width: columnWidths[0], align: "left" });
          doc.text(item.value || "N/A", startX + columnWidths[0], y, { width: columnWidths[1], align: "left" });
          doc.text(`$${unitPrice.toFixed(2)}`, startX + columnWidths[0] + columnWidths[1], y, { width: columnWidths[2], align: "right" });
          doc.text(quantity.toString(), startX + columnWidths[0] + columnWidths[1] + columnWidths[2], y, { width: columnWidths[3], align: "center" });
          doc.text(`$${totalCost.toFixed(2)}`, startX + columnWidths[0] + columnWidths[1] + columnWidths[2] + columnWidths[3], y, { width: columnWidths[4], align: "right" });

          y += 20;
        });
      }

      doc.moveDown(1);

      // Summary Section - Align Total Cost to the Right
      let subtotal = data.quotationDetails.reduce((acc, item) => acc + ((item.price || 0) * (item.quantity || 1)), 0);
      let tax = subtotal * 0.1; // Assuming 10% tax
      let grandTotal = subtotal + tax;

      const summaryX = 350; // Move summary to right side
      doc.fontSize(12);
      doc.text(`Subtotal:`, summaryX, doc.y, { align: "right" });
      doc.text(`$${subtotal.toFixed(2)}`, summaryX + 100, doc.y, { align: "right" });

      doc.text(`Taxes (if applicable):`, summaryX, doc.y, { align: "right" });
      doc.text(`$${tax.toFixed(2)}`, summaryX + 100, doc.y, { align: "right" });

      doc.text(`Grand Total:`, summaryX, doc.y, { align: "right", bold: true });
      doc.text(`$${grandTotal.toFixed(2)}`, summaryX + 100, doc.y, { align: "right", bold: true });

      doc.moveDown(2);

      // Signature Section - Proper Alignment
      const pageWidth = doc.page.width - 100; // Get the usable width
      const signatureX = 50; // Left position for "Authorized Signature"
      const clientX = pageWidth - 150; // Right position for "Client Acceptance"

      doc.fontSize(12);
      doc.text("Authorized Signature:", signatureX, doc.y, { align: "left" });
      doc.text("Client Acceptance:", clientX, doc.y, { align: "right" });

      doc.moveDown(1);
      doc.text("_____________________", signatureX, doc.y, { align: "left" });
      doc.text("_____________________", clientX, doc.y, { align: "right" });

      doc.end();

      stream.on("finish", () => resolve(filePath));
      stream.on("error", reject);
    } catch (error) {
      reject(error);
    }
  });
};



/*************************************
const generatePDF = async (data, filePath) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Validate Data
      if (!data || !data.userDetails || !data.quotationDetails) {
        throw new Error("Invalid data structure");
      }

      // === ADD BLACK HEADER ===
      doc.rect(0, 0, doc.page.width, 60).fill("black"); // Black background bar

      // === ADD IMAGE TO HEADER ===
      const imageUrl = "https://amidoor.com/wp-content/uploads/2022/04/AMI_FullLogo-Horizontal-ColorReverse-RGB-500x235px-1.png"; // URL for the image
      doc.image(imageUrl, 50, 5, { width: 100, height: 20 });      

      // Quote No & Date
      doc.fontSize(12)
        .text(`Quote No: ${data.quotationMasterId || "N/A"}`, { continued: true })
        .text(`Date: ${new Date().toLocaleDateString()}`, { align: "right" })
        .moveDown(1);

      // Bill To (Left) and Bill From (Right)
      doc.fontSize(12).fillColor("#FFA500").text("Bill To:", { continued: false });
      doc.moveUp();
      doc.text("Bill From:", { align: "right" });

      doc.fillColor("black");
      doc.text(`${data.userDetails.full_name || "N/A"}`, { continued: false });
      doc.moveUp();
      doc.text("[Furniture Company Name]", { align: "right" });

      doc.text(`${data.userDetails.address || "N/A"}`, { continued: false });
      doc.moveUp();
      doc.text("[Company Address]", { align: "right" });

      doc.text(`${data.userDetails.mobile_no || "N/A"}`, { continued: false });
      doc.moveUp();
      doc.text("[Phone Number]", { align: "right" });

      doc.text(`${data.userDetails.email || "N/A"}`, { continued: false });
      doc.moveUp();
      doc.text("[Email Address]", { align: "right" });

      doc.moveDown(1);

      // Custom Furniture Details Table
      doc.fontSize(14).text("Custom Furniture Details", { underline: true }).moveDown(0.5);

      if (!Array.isArray(data.quotationDetails) || data.quotationDetails.length === 0) {
        doc.fontSize(12).fillColor("red").text("No quotation details available.", { align: "center" });
      } else {
        // Table Headers
        const headers = ["Category", "Item", "Unit Price", "Quantity", "Total Cost"];
        const columnWidths = [100, 150, 70, 60, 80]; // Adjusted widths
        let startX = doc.x;
        let y = doc.y;

        doc.font("Helvetica-Bold");
        headers.forEach((header, i) => {
          doc.text(header, startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), y, {
            width: columnWidths[i],
            align: "center",
          });
        });

        y += 20;
        doc.font("Helvetica");

        // Draw Table Rows
        data.quotationDetails.forEach((item, index) => {
          if (!item) return; // Skip invalid items

          let unitPrice = item.price || 0; // Ensure price is valid
          let quantity = item.quantity || 1; // Default to 1 if quantity is missing
          let totalCost = unitPrice * quantity; // Correct multiplication

          doc.text(item.category || "N/A", startX, y, { width: columnWidths[0], align: "left" });
          doc.text(item.title || "N/A", startX + columnWidths[0], y, { width: columnWidths[1], align: "left" });
          doc.text(`$${unitPrice.toFixed(2)}`, startX + columnWidths[0] + columnWidths[1], y, { width: columnWidths[2], align: "right" });
          doc.text(quantity.toString(), startX + columnWidths[0] + columnWidths[1] + columnWidths[2], y, { width: columnWidths[3], align: "center" });
          doc.text(`$${totalCost.toFixed(2)}`, startX + columnWidths[0] + columnWidths[1] + columnWidths[2] + columnWidths[3], y, { width: columnWidths[4], align: "right" });

          y += 20;
        });
      }

      doc.moveDown(1);

      // Summary Section - Align Total Cost to the Right
      let subtotal = data.quotationDetails.reduce((acc, item) => acc + ((item.price || 0) * (item.quantity || 0)), 0);
      let tax = subtotal * 0.1; // Assuming 10% tax
      let grandTotal = subtotal + tax;

      const summaryX = 350; // Move summary to right side
      doc.fontSize(12);
      doc.text(`Subtotal:`, summaryX, doc.y, { align: "right" });
      doc.text(`$${subtotal.toFixed(2)}`, summaryX + 100, doc.y, { align: "right" });

      doc.text(`Taxes (if applicable):`, summaryX, doc.y, { align: "right" });
      doc.text(`$${tax.toFixed(2)}`, summaryX + 100, doc.y, { align: "right" });

      doc.text(`Grand Total:`, summaryX, doc.y, { align: "right", bold: true });
      doc.text(`$${grandTotal.toFixed(2)}`, summaryX + 100, doc.y, { align: "right", bold: true });

      doc.moveDown(2);

      // Signature Section - Proper Alignment
      const pageWidth = doc.page.width - 100; // Get the usable width
      const signatureX = 50; // Left position for "Authorized Signature"
      const clientX = pageWidth - 150; // Right position for "Client Acceptance"

      doc.fontSize(12);
      doc.text("Authorized Signature:", signatureX, doc.y, { align: "left" });
      doc.text("Client Acceptance:", clientX, doc.y, { align: "right" });

      doc.moveDown(1);
      doc.text("_____________________", signatureX, doc.y, { align: "left" });
      doc.text("_____________________", clientX, doc.y, { align: "right" });

      doc.end();

      stream.on("finish", () => resolve(filePath));
      stream.on("error", reject);
    } catch (error) {
      reject(error);
    }
  });
};*////////////////




/*
const generatePDF = async (data, filePath) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Check if data is valid
      if (!data || !data.userDetails || !data.quotationDetails) {
        throw new Error("Invalid data structure");
      }

      // Title: QUOTATION
      doc.fontSize(24).text("QUOTATION", { align: "center", underline: true }).moveDown(1);

      // Quote No & Date
      doc.fontSize(12).text(`Quote No: ${data._id || "N/A"}`, { continued: true });
      doc.text(`Date: ${new Date().toLocaleDateString()}`, { align: "right" }).moveDown(1);

      // Bill To & Bill From
      doc.fontSize(12).fillColor("#FFA500").text("Bill To:").fillColor("black");
      doc.text(`${data.userDetails.full_name || "N/A"}`);
      doc.text(`${data.userDetails.address || "N/A"}`);
      doc.text(`${data.userDetails.mobile_no || "N/A"}`);
      doc.text(`${data.userDetails.email || "N/A"}`).moveDown(1);

      doc.fontSize(12).fillColor("#FFA500").text("Bill From:").fillColor("black");
      doc.text("[Furniture Company Name]");
      doc.text("[Company Address]");
      doc.text("[Phone Number]");
      doc.text("[Email Address]").moveDown(1);

      // Custom Furniture Details Table
      doc.fontSize(11).text("Custom Furniture Details", { underline: true }).moveDown(0.5);

      // Check if quotation details exist
      if (!Array.isArray(data.quotationDetails) || data.quotationDetails.length === 0) {
        doc.fontSize(12).fillColor("red").text("No quotation details available.", { align: "center" });
      } else {
        const headers = ["Category", "Item", "Unit Price", "Quantity", "Total Cost"];
        const columnWidths = [100, 150, 70, 80, 60]; // Adjusted widths
        const startX = doc.x;
        let y = doc.y;

        // Draw Headers
        doc.font("Helvetica-Bold");
        headers.forEach((header, i) => {
          doc.text(header, startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), y, {
            width: columnWidths[i],
            align: "center",
          });
        });

        y += 20;
        doc.font("Helvetica");

        // Draw Rows
        data.quotationDetails.forEach((item, index) => {
          if (!item) return; // Skip invalid items

          let totalCost = (item.price || 0) * (item.quantity || 1);

          doc.text(item.title || "N/A", startX, y, { width: columnWidths[0], align: "left" });
          doc.text(item.value || "N/A", startX + columnWidths[0], y, { width: columnWidths[1], align: "left" });
          doc.text(`$${(item.price || 0).toFixed(2)}`, startX + columnWidths[0] + columnWidths[1], y, { width: columnWidths[2], align: "right" });
          doc.text(item.quantity || "1", startX + columnWidths[0] + columnWidths[1] + columnWidths[2], y, { width: columnWidths[3], align: "center" });
          doc.text(`$${totalCost.toFixed(2)}`, startX + columnWidths[0] + columnWidths[1] + columnWidths[2] + columnWidths[3], y, { width: columnWidths[4], align: "right" });

          y += 20;
        });
      }

      doc.moveDown(1);

      // Summary Section
      let subtotal = data.quotationDetails.reduce((acc, item) => acc + ((item.price || 0) * (item.quantity || 1)), 0);
      let tax = subtotal * 0.1; // Assuming 10% tax
      let grandTotal = subtotal + tax;

      doc.fontSize(12);
      doc.text(`Subtotal: $${subtotal.toFixed(2)}`, { align: "right" });
      doc.text(`Taxes (if applicable): $${tax.toFixed(2)}`, { align: "right" });
      doc.text(`Grand Total: $${grandTotal.toFixed(2)}`, { align: "right", bold: true }).moveDown(1);

      // Signature Section
      doc.moveDown(2);
      doc.fontSize(12);
      doc.text("Authorized Signature: ________________________", { align: "left" });
      doc.text("Client Acceptance: __________________________", { align: "right" });

      doc.end();

      stream.on("finish", () => resolve(filePath));
      stream.on("error", reject);
    } catch (error) {
      reject(error);
    }
  });
};*/



router.get("/users-with-new-quotations", async (req, res) => {
  try {
    const data = await getUsersWithNewQuotations();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

const getUsersWithNewQuotations = async () => {
  try {
    const usersWithNewQuotations = await UserQuotationMaster.aggregate([
      {
        $match: { status: "New" } // Filter records where status is "New"
      },
      {
        $lookup: {
          from: "quotation_users", // Referencing the quotationUserSchema
          localField: "quotation_user_id",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      {
        $unwind: "$userDetails" // Convert array to object
      },
      {
        $project: {
          _id: 1,
          title: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          "userDetails.full_name": 1,
          "userDetails.email": 1,
          "userDetails.company": 1,
          "userDetails.mobile_no": 1,
          "userDetails.zip_code": 1,
          "userDetails.address": 1,
          "userDetails.shipping_method": 1
        }
      }
    ]);

    return usersWithNewQuotations;
  } catch (error) {
    console.error("Error fetching users with new quotations:", error);
    throw error;
  }
};



// Register By Email
router.post('/create_quotation', async (req, res) => {
    try {
        let quotation = {};
        const { quotation_user_id,quotation_for,userJourneyDetails } = req.body;
        const status = 'New';

        console.log(userJourneyDetails);

        quotation = new UserQuotationMaster( {quotation_user_id,title: quotation_for, status} );
        const savedQuotation = await quotation.save();

        // Save each detail item
        const detailPromises = userJourneyDetails.map(detail => {
          return new UserQuotationDetail({
              quotation_master_id: savedQuotation._id,
              sequence_id: detail.sequenct_id,
              title: detail.label,
              value: detail.value,
              price: detail.price || undefined // Optional: skip if not present
          }).save();
        });

        await Promise.all(detailPromises);
        res.status(200).json({ message: 'Quotation created successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error creating Company', error });
    }
});
/*
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
  
/*      const htmlDetails = userJourneyDetails.map(item => {
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

/*router.post('/update_user_info', async (req, res) => {
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
});*/



module.exports = router;

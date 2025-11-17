const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOrderStatusEmail = async (toEmail, orderId, status) => {
  const subjectMap = {
    verified: "Your Order is Verified",
    shipped: "Your Order Has been Shipped",
    cancelled: "Your Order Has Been Cancelled"
  };

  const textMap = {
    verified: `Your order #${orderId} has been verified and is being processed.`,
    shipped: `Your order #${orderId} has been shipped. We'll send tracking info soon!`,
    cancelled: `We inform you that order #${orderId} has been cancelled.`
  };

  if (!subjectMap[status]) {
    console.log(`No email template for status: ${status}`);
    return;
  }

  try {
    await transporter.sendMail({
      from: `"EDD Pharmacy" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: subjectMap[status],
      text: textMap[status],
      html: `<b>${textMap[status]}</b>`
    });
    console.log(`Email sent for order ${orderId} to ${toEmail}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = {
  sendOrderStatusEmail
};
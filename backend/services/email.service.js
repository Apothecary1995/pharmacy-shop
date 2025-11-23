const sgMail = require('@sendgrid/mail'); 
require('dotenv').config();

// sendgrid api removed causesapi conflict with stripe secret key .env backend
sgMail.setApiKey(process.env.SENDGRID_API_KEY); 

const sendOrderStatusEmail = async (toEmail, orderId, status) => {
    const subjectMap = { 
        verified: "Your Order is Verified BY me a 🐉",
        shipped: "Your Order Has been Shipped 愛",
        cancelled: "Your Order Has Been Cancelled 警察"
    };

    const textMap = {
        verified: `Your order #${orderId} has been verified by admin and is being processed.`,
        shipped: `Your order #${orderId} has been shipped stay on track `,
        cancelled: `Your order #${orderId} has been cancelled.`
    };

    if (!subjectMap[status]) {
        console.log(`No email template for status: ${status}`);
        return;
    }

    const msg = {
        to: toEmail,
        from: process.env.EMAIL_USER, 
        subject: subjectMap[status],
        text: textMap[status],
        html: `<b>${textMap[status]}</b>`,
    };

    try {
        await sgMail.send(msg); 
        console.log(`Email sent via SendGrid API for order ${orderId} to ${toEmail}`);
    } catch (error) {
        console.error("Error sending email via SendGrid API:", error.response ? error.response.body : error); 
    }
};

module.exports = {
    sendOrderStatusEmail
};
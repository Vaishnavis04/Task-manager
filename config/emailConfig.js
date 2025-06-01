require('dotenv').config(); // ✅ Load environment variables
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,         // smtp.gmail.com
  port: process.env.EMAIL_PORT || 587,
  secure: false,                        // false for port 587 (TLS)
  auth: {
    user: process.env.EMAIL_USER,      // your Gmail
    pass: process.env.EMAIL_PASS,      // your app password
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error('Email transporter error:', error);
  } else {
    console.log('✅ Email transporter is ready');
  }
});

module.exports = transporter;

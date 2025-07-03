const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendEmail(email, subject, text) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: Number(process.env.PORT),
      service: process.env.SERVICE,
      secure: Boolean(process.env.SECURE),
      auth: {
        user: process.env.USER,
        pass: process.env.PASS
      }
    });

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      text: text
    });

    console.log("Email sent successfully");
  } catch (e) {
    console.log("Email not sent");
    console.log(e);
  }
}

module.exports = {
  sendEmail
};

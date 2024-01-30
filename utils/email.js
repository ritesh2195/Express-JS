const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //   const transporter = nodemailer.createTransport({
  //     host: process.env.EMAIL_HOST,
  //     port: process.env.EMAIL_PORT,
  //     auth: {
  //       user: process.env.EMAIL_USERNAME,
  //       pass: process.env.EMAIL_PASSWORD,
  //     },
  //   });

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'cary.johns@ethereal.email',
      pass: 'VRkXgvJxMAD1wkSy3V',
    },
  });

  const mailOptions = {
    from: 'ritesh <hello@mishra.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;

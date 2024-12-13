const nodemailer = require("nodemailer");

exports.transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER_SENDLER,
    pass: process.env.EMAIL_USER_APP_PASSWORD,
  },
});

exports.mailOptions = ({ toUser, subject, text, html }) => {
  return {
    from: process.env.EMAIL_USER_SENDLER,
    to: toUser,
    subject,
    text,
    html,
  };
};

const nodemailer = require("nodemailer");
const { emailUser } = require("../consts/default");

exports.transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailUser,
    pass: "kcvv kmir eriy cbbr",
  },
});

exports.mailOptions = ({ toUser, subject, text, html }) => {
  return {
    from: emailUser,
    to: toUser,
    subject,
    text,
    html,
  };
};

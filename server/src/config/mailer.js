import nodemailer from "nodemailer";

const smtpPort = Number(process.env.SMTP_PORT || 2525);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,

  port: smtpPort,

  secure: smtpPort === 465,

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export default transporter;

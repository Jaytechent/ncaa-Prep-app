const nodemailer = require('nodemailer');

let transporter;

// Created lazily so the server still boots if email isn't configured yet.
const getTransporter = () => {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_USER || !SMTP_PASS) {
    throw new Error('Email is not configured: set SMTP_USER and SMTP_PASS in .env');
  }

  transporter = nodemailer.createTransport(
    SMTP_HOST
      ? {
          // Any SMTP provider (Brevo, Mailtrap, SendGrid, etc.)
          host: SMTP_HOST,
          port: Number(SMTP_PORT) || 587,
          secure: SMTP_SECURE === 'true', // true for 465, false for 587
          auth: { user: SMTP_USER, pass: SMTP_PASS },
        }
      : {
          // Default: Gmail with an App Password
          service: 'gmail',
          auth: { user: SMTP_USER, pass: SMTP_PASS },
        }
  );
  return transporter;
};

const sendEmail = async ({ to, subject, html, text }) => {
  const from = process.env.EMAIL_FROM || `NCAA Prep <${process.env.SMTP_USER}>`;
  return getTransporter().sendMail({ from, to, subject, html, text });
};

module.exports = sendEmail;
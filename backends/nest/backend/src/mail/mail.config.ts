import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER, // your email
    pass: process.env.GMAIL_PASS, // your 16-char app password
  },
});

export const mailOptions = {
  from: process.env.GMAIL_USER,
  to: process.env.GMAIL_USER, // you can also forward to another email
};

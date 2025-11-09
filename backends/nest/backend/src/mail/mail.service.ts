import { Injectable } from '@nestjs/common';
import VerifyCodeTemplate from '../templates/verifycode.template';
import nodemailer from "nodemailer";

@Injectable()
export class MailService {
  transporter: nodemailer.Transporter;
  constructor() {
    console.log(process.env.GMAIL_USER)
    this.transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER, // your email
    pass: process.env.GMAIL_PASS, // your 16-char app password
  },
});
  }

  async sendVerificationEmail(email: string, code: string): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Email Verification',
      html: VerifyCodeTemplate(code),
    });
  }
}

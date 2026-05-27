import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `http://localhost:5000/auth/verify/${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,

    to: email,

    subject: "Verify Your SecureVault Account",

    html: `
      <h2>Welcome to SecureVault</h2>

      <p>Click below to verify your email:</p>

      <a href="${verificationUrl}">
        Verify Account
      </a>
    `,
  });
};

export default sendVerificationEmail;
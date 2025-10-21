// utilis/nodemailer.ts
import nodemailer from "nodemailer";

export const sendEmail = async (to: string, subject: string, html: string) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: "gmail", // You can change this to "hotmail", "yahoo", etc.
    auth: {
      user: process.env.USER_EMAIL, // your Gmail address
      pass: process.env.APP_PASSWORD, // Gmail App Password if 2FA is on
    },
  });

  // Send the email
  await transporter.sendMail({
    from:  `"WildBerries Company" <${process.env.EMAIL_USER}> `,
    to,
    subject,
    html,
  });

  console.log(`Email sent to ${to}`);
};

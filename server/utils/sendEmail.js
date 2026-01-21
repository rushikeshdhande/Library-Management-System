import nodemailer from "nodemailer";

export const sendEmail = async ({ email, subject, message }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.verify();

    await transporter.sendMail({
      from: `"Rushikesh Dhande" <${process.env.SMTP_MAIL}>`,
      to: email,
      subject,
      html: message,
    });

    return true;
  } catch (error) {
    console.error("Email send failed:", error.message);
    throw error;
  }
};

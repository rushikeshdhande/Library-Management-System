import { generateVerificationOtpEmailTemplate } from "./emailTemplates.js";
import { sendEmail } from "./sendEmail.js";

export async function sendVerificationCode(verificationCode, email) {
  try {
    const message = generateVerificationOtpEmailTemplate(verificationCode);

    await sendEmail({
      email,
      subject: "Verification Code (Rushikesh Library Management System)",
      message,
    });

    return true;
  } catch (error) {
    console.error("OTP send failed:", error.message);
    throw new Error("Failed to send OTP email");
  }
}

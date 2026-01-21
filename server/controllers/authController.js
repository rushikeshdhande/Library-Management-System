import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendVerificationCode } from "../utils/sendVerificationCode.js";
import { sendToken } from "../utils/sendToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import { generateForgotPasswordEmailTemplate } from "../utils/emailTemplates.js";

/* ================= REGISTER ================= */
export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new ErrorHandler("Please enter all fields.", 400));
  }

  const isRegistered = await User.findOne({
    email,
    accountVerified: true,
  });

  if (isRegistered) {
    return next(new ErrorHandler("User already exists", 400));
  }

  const attempts = await User.find({
    email,
    accountVerified: false,
  });

  if (attempts.length >= 5) {
    return next(
      new ErrorHandler(
        "You have exceeded the number of registration attempts.",
        400
      )
    );
  }

  if (password.length < 8 || password.length > 16) {
    return next(
      new ErrorHandler("Password must be between 8 and 16 characters.", 400)
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const verificationCode = await user.generateVerificationCode();
  await user.save();

  // 🔥 FIXED OTP SEND
  await sendVerificationCode(verificationCode, email);

  res.status(200).json({
    success: true,
    message: "Verification code sent successfully.",
  });
});

/* ================= VERIFY OTP ================= */
export const verifyOTP = catchAsyncErrors(async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return next(new ErrorHandler("Email or OTP is missing.", 400));
  }

  const users = await User.find({
    email,
    accountVerified: false,
  }).sort({ createdAt: -1 });

  if (!users || users.length === 0) {
    return next(new ErrorHandler("User not found.", 404));
  }

  const user = users[0];

  if (user.verificationCode !== Number(otp)) {
    return next(new ErrorHandler("Invalid OTP.", 400));
  }

  const verificationCodeExpire = new Date(
    user.verificationCodeExpire
  ).getTime();

  if (Date.now() > verificationCodeExpire) {
    return next(new ErrorHandler("OTP expired.", 400));
  }

  user.accountVerified = true;
  user.verificationCode = null;
  user.verificationCodeExpire = null;

  await user.save({ validateModifiedOnly: true });

  sendToken(user, 200, "Account verified successfully.", res);
});

/* ================= LOGIN ================= */
export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter all fields.", 400));
  }

  const user = await User.findOne({
    email,
    accountVerified: true,
  }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password.", 400));
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password.", 400));
  }

  sendToken(user, 200, "User login successfully.", res);
});

/* ================= LOGOUT ================= */
export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: true,
      sameSite: "None",
    })
    .json({
      success: true,
      message: "Logged out successfully.",
    });
});

/* ================= GET USER ================= */
export const getUser = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

/* ================= FORGOT PASSWORD ================= */
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  if (!req.body.email) {
    return next(new ErrorHandler("Email is required.", 400));
  }

  const user = await User.findOne({
    email: req.body.email,
    accountVerified: true,
  });

  if (!user) {
    return next(new ErrorHandler("Invalid email.", 400));
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
  const message = generateForgotPasswordEmailTemplate(resetPasswordUrl);

  await sendEmail({
    email: user.email,
    subject: "Bookworm Library Management System Password Recovery",
    message,
  });

  res.status(200).json({
    success: true,
    message: `Email sent to ${user.email} successfully.`,
  });
});

/* ================= RESET PASSWORD ================= */
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset password token is invalid or has been expired.",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new ErrorHandler("Password & confirm password do not match.", 400)
    );
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, "Password reset successfully.", res);
});

/* ================= UPDATE PASSWORD ================= */
export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");

  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return next(new ErrorHandler("Please enter all fields.", 400));
  }

  const isPasswordMatched = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Current password is incorrect.", 400));
  }

  if (newPassword !== confirmNewPassword) {
    return next(
      new ErrorHandler(
        "New password and confirm new password do not match.",
        400
      )
    );
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password updated.",
  });
});

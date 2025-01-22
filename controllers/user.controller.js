const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/user.model");
const Otp = require("../models/otp.model");

exports.signUp = async (req, res) => {
  try {
    const { name, email, phone, password, date_of_birth } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    console.log("existingUser",existingUser)
    const hash_password = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      phone,
      password: hash_password,
      date_of_birth,
    });
    await newUser.save();

    // const token = jwt.sign(
    //   { userId: newUser._id, email: newUser.email || "1h" },
    //   process.env.JWT_SECRET,
    //   { expiresIn: process.env.JWT_EXPIRES }
    // );

    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );

    res.status(201).json({ token, userId: newUser._id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error signing up" });
  }
};

exports.logIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }, { email: 1, password: 1 });
    if (!user) {
      return res.status(404).json({ message: "Incorrect Email" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Incorrect Password" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );

    res.status(200).json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: "Error signing in", error });
  }
};

exports.getUser = async (req, res) => {
  try {
    const users = await User.findOne({ _id: req.userId }, { password: 0 });
    res.status(200).json({
      status: "Success",
      data: users,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Something went wrong",
    });
  }
};

// Get All Signed-Up Users
exports.getAllUsers = async (req, res) => {
  try {
    // Fetch all users from the database, excluding the password field
    const users = await User.find().select("-password");

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

exports.sendForgetPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Valid email is required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User with this email does not exist",
      });
    }

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to the database
    await Otp.updateOne(
      { email },
      { email, otp, createdAt: Date.now() },
      { upsert: true } // Create if it doesn't exist
    );

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: "Password Reset OTP",
      text: `Your password reset OTP is ${otp}. It is valid for 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error sending OTP",
      error: error.message,
    });
  }
};

// Verify OTP
exports.verifyForgetPasswordOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const otpEntry = await Otp.findOne({ email });

    if (!otpEntry) {
      return res.status(400).json({
        success: false,
        message: "OTP not found or has expired",
      });
    }

    if (otpEntry.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error verifying OTP",
      error: error.message,
    });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP, and new password are required",
      });
    }

    const otpEntry = await Otp.findOne({ email });

    if (!otpEntry || otpEntry.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in the user model
    await User.updateOne({ email }, { password: hashedPassword });

    // Delete OTP after successful password reset
    await Otp.deleteOne({ email });

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error resetting password",
      error: error.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    console.log("req.files", req.files);
    const files = req.files || [];
    const paths = files.map((file) => file.path);

    const users = await User.findByIdAndUpdate(req.userId, {
      avatars: paths,
    });

    res.status(200).json({
      status: "Successfully updated",
      data: { users, files: req.files },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { userId } = req.user; // Assume you have user authentication middleware that adds `req.user`
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Compare current password with stored hash
    const isPasswordMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect current password",
      });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error changing password",
      error: error.message,
    });
  }
};

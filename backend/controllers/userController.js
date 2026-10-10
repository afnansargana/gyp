const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { secretKey } = require("../config");
const {
  issueOtp,
  canResendOtp,
  verifyUserOtp,
  RESEND_COOLDOWN_MS,
} = require("../services/otp.service");

function signAuthToken(user) {
  return jwt.sign(
    {
      userId: user._id,
      isAdmin: user.isAdmin,
      isMechanic: user.isMechanic,
    },
    secretKey,
    { expiresIn: "1h" }
  );
}

function authResponse(user, token) {
  return {
    token,
    userId: user._id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
    isMechanic: user.isMechanic,
    isVerified: user.isVerified,
  };
}

const userController = {
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      if (String(password).length < 8) {
        return res
          .status(400)
          .json({ message: "Password must be at least 8 characters" });
      }

      const existingUser = await User.findOne({
        $or: [{ username }, { email: email.toLowerCase() }],
      });

      if (existingUser) {
        // Allow re-register flow for unverified accounts with same email
        if (
          !existingUser.isVerified &&
          existingUser.email.toLowerCase() === email.toLowerCase()
        ) {
          existingUser.username = username;
          existingUser.password = password;
          await existingUser.save();

          const otpPayload = await issueOtp(existingUser);
          return res.status(200).json({
            message: "Account pending verification. OTP resent.",
            requiresOtp: true,
            email: existingUser.email,
            expiresAt: otpPayload.expiresAt,
            ...(otpPayload.otp ? { otp: otpPayload.otp } : {}),
          });
        }

        return res
          .status(400)
          .json({ message: "Username or email already exists" });
      }

      const newUser = new User({
        username,
        email: email.toLowerCase(),
        password,
        isVerified: false,
      });
      await newUser.save();

      const otpPayload = await issueOtp(newUser);

      res.status(201).json({
        message: "Registration started. Please verify the OTP sent to your email.",
        requiresOtp: true,
        email: newUser.email,
        expiresAt: otpPayload.expiresAt,
        ...(otpPayload.otp ? { otp: otpPayload.otp } : {}),
      });
    } catch (error) {
      console.error("Error registering user:", error);
      res
        .status(500)
        .json({ message: "Failed to register user: Server Error" });
    }
  },

  verifyOtp: async (req, res) => {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
      }

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const result = await verifyUserOtp(user, otp);

      if (!result.ok) {
        const messages = {
          already_verified: "Account is already verified. Please log in.",
          no_otp: "No OTP pending. Please request a new code.",
          expired: "OTP has expired. Please request a new code.",
          invalid: "Invalid OTP. Please try again.",
        };
        return res
          .status(400)
          .json({ message: messages[result.reason] || "OTP verification failed" });
      }

      const token = signAuthToken(user);
      user.tokens = user.tokens.concat({ token });
      await user.save();

      res.status(200).json({
        message: "Email verified successfully",
        ...authResponse(user, token),
      });
    } catch (error) {
      console.error("Error verifying OTP:", error);
      res.status(500).json({ message: "Failed to verify OTP: Server Error" });
    }
  },

  resendOtp: async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.isVerified) {
        return res
          .status(400)
          .json({ message: "Account is already verified. Please log in." });
      }

      const cooldown = canResendOtp(user);
      if (!cooldown.allowed) {
        return res.status(429).json({
          message: "Please wait before requesting another OTP",
          retryAfterMs: cooldown.retryAfterMs,
          cooldownMs: RESEND_COOLDOWN_MS,
        });
      }

      const otpPayload = await issueOtp(user);

      res.status(200).json({
        message: "OTP resent successfully",
        requiresOtp: true,
        email: user.email,
        expiresAt: otpPayload.expiresAt,
        ...(otpPayload.otp ? { otp: otpPayload.otp } : {}),
      });
    } catch (error) {
      console.error("Error resending OTP:", error);
      res.status(500).json({ message: "Failed to resend OTP: Server Error" });
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      const user = await User.findOne({ username });
      if (!user) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }

      if (!user.isVerified) {
        const otpPayload = await issueOtp(user);
        return res.status(403).json({
          message: "Email not verified. Please enter the OTP we just sent.",
          requiresOtp: true,
          email: user.email,
          expiresAt: otpPayload.expiresAt,
          ...(otpPayload.otp ? { otp: otpPayload.otp } : {}),
        });
      }

      const token = signAuthToken(user);
      user.tokens = user.tokens.concat({ token });
      await user.save();

      res.status(200).json(authResponse(user, token));
    } catch (error) {
      console.error("Error logging in user:", error);
      res.status(500).json({ message: "Failed to login: Server Error" });
    }
  },

  getUserProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user.userId)
        .select("-password")
        .populate({
          path: "orders",
          populate: { path: "products.product" }, // Adjust based on your schema
        })
        .populate({
          path: "appointments",
          populate: { path: "service" }, // Adjust based on your schema
        });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Server Error" });
    }
  },

  updateUserProfile: async (req, res) => {
    try {
      const { username, email } = req.body;
      const updateData = { username, email };

      if (req.file) {
        updateData.profileImage = `/uploads/${req.file.filename}`;
      }

      const user = await User.findByIdAndUpdate(req.user.userId, updateData, {
        new: true,
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Server Error" });
    }
  },

  deleteUserAccount: async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User account deleted successfully" });
    } catch (error) {
      console.error("Error deleting user account:", error);
      res.status(500).json({ message: "Server Error" });
    }
  },
  getAllUsers: async (req, res) => {
    try {
      console.log("Fetching all users..."); // Debug log
      const users = await User.find().select("-password");
      console.log("Users fetched:", users); // Debug log
      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users: Server Error" });
    }
  },

  // New: Update user roles (Admin/Mechanic)
  updateUserRole: async (req, res) => {
    const { userId, isAdmin, isMechanic } = req.body;

    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      user.isAdmin = isAdmin;
      user.isMechanic = isMechanic;

      await user.save();
      res.status(200).json(user);
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({ message: "Server Error" });
    }
  },
};

module.exports = userController;

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      sparse: true, // Allows null/missing emails for mobile users while keeping uniqueness for web
      lowercase: true,
    },
    
    mobileNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    
    username: {
      type: String,
      unique: true,
      sparse: true,
    },
    
    name: {
      type: String,
    },
    
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', 'Not Specified'],
      default: 'Not Specified'
    },
    
    animeProfilePicture: {
      type: String,
    },

    password: {
      type: String,
      required: function () {
        return this.authProvider === "email";
      },
    },

    authProvider: {
      type: String,
      enum: ["email", "google"],
      default: "email",
    },

    googleId: {
      type: String,
    },

    
    isVerified: {
      type: Boolean,
      default: false,
    },

    otp: {
      type: String, 
    },

    otpExpiresAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

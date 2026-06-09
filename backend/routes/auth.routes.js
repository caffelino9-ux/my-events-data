const express = require('express');
const User = require('../models/User/User');
const jwt = require('jsonwebtoken');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'caffelino_secret_key';

// Demo Mobile Sign Up / Login (Generates OTP)
router.post('/mobile-login', async (req, res) => {
  try {
    const { mobileNumber } = req.body;

    if (!mobileNumber) {
      return res.status(400).json({ message: 'Mobile number is required' });
    }

    let user = await User.findOne({ mobileNumber });

    if (!user) {
      // Create a shell user without name/username, they will be prompted in Profile Setup
      user = new User({
        mobileNumber,
        authProvider: 'mobile'
      });
      await user.save();
    }

    // In a real app, integrate Twilio here. For demo, we return OTP 123456
    const demoOtp = '123456';
    user.otp = demoOtp;
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
    await user.save();

    return res.status(200).json({ message: 'OTP sent successfully', otp: demoOtp });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Verify OTP
router.post('/mobile-verify-otp', async (req, res) => {
  try {
    const { mobileNumber, otp } = req.body;

    const user = await User.findOne({ mobileNumber });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (new Date() > user.otpExpiresAt) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    // Clear OTP
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id, role: 'user' }, JWT_SECRET, { expiresIn: '30d' });

    const isNewUser = !user.name || user.name.trim() === '';

    return res.status(200).json({
      message: 'Login successful',
      token,
      isNewUser,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        mobileNumber: user.mobileNumber,
        photo: user.animeProfilePicture,
        role: 'user'
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Complete Profile Setup for new mobile users
router.post('/profile-setup', async (req, res) => {
  try {
    // In a real app, you would verify the JWT token here.
    // For demo, we just trust the userId sent from the client.
    const { userId, name, username, profilePicture } = req.body;

    if (!userId || !name || !username) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if username is taken
    const existingUser = await User.findOne({ username, _id: { $ne: userId } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name;
    user.username = username;
    if (profilePicture) {
      user.animeProfilePicture = profilePicture;
    }

    await user.save();

    return res.status(200).json({
      message: 'Profile setup complete',
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        mobileNumber: user.mobileNumber,
        photo: user.animeProfilePicture,
        role: 'user'
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

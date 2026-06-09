const express = require('express');
const Feedback = require('../models/Feedback');

const router = express.Router();

// Submit Feedback
router.post('/', async (req, res) => {
  try {
    const { userId, name, profilePicture, comment, rating } = req.body;

    if (!userId || !name || !comment) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const feedback = new Feedback({
      userId,
      name,
      profilePicture,
      comment,
      rating: rating || 5
    });

    await feedback.save();
    return res.status(201).json(feedback);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get all Feedbacks
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    return res.status(200).json(feedbacks);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

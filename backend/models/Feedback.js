const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
    },
    comment: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      default: 5,
    },
    likes: {
      type: Number,
      default: 0,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);

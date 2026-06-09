const mongoose = require("mongoose");

const GroupSelectedCafeSchema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GroupAdmin",
      required: true,
      unique: true, // one selected cafe per group
    },
    cafe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cafe",
      required: true, // selected cafe
    },
    status: {
      type: String,
      enum: ["pending", "confirmed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GroupSelectedCafe", GroupSelectedCafeSchema);

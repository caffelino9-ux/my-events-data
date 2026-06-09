const mongoose = require("mongoose");

const GroupMemberSchema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GroupAdmin",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

GroupMemberSchema.index({ group: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("GroupMember", GroupMemberSchema);

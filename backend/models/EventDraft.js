const mongoose = require('mongoose');

const eventDraftSchema = new mongoose.Schema(
  {
    organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    draftData: { type: mongoose.Schema.Types.Mixed, default: {} },
    currentStep: { type: Number, default: 1 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('EventDraft', eventDraftSchema);

const mongoose = require('mongoose');

const refundSchema = new mongoose.Schema(
  {
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', required: true },
    registrationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Registration', required: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Processed', 'Failed'], default: 'Pending' },
    refundReference: { type: String } // Transaction ID from gateway for refund
  },
  { timestamps: true }
);

module.exports = mongoose.model('Refund', refundSchema);

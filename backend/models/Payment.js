const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    transactionId: { type: String, required: true, unique: true },
    registrationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Registration' },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional, could be guest
    organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    status: { type: String, enum: ['Success', 'Failed', 'Refunded', 'Pending'], default: 'Pending' },
    paymentMethod: { type: String }, // e.g., UPI, Credit Card, NetBanking
    gatewayResponse: { type: Object }, // Store raw response for debugging
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);

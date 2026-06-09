const mongoose = require('mongoose');

const settlementSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    totalRevenue: { type: Number, required: true }, // Total ticket sales revenue
    platformFeePercentage: { type: Number, required: true, default: 5 }, // Platform takes 5%
    platformFeeAmount: { type: Number, required: true },
    amountPayable: { type: Number, required: true }, // Revenue - Platform Fee
    status: { type: String, enum: ['Pending', 'Processing', 'Paid'], default: 'Pending' },
    utrNumber: { type: String }, // Unique Transaction Reference from Bank transfer
    paymentDate: { type: Date },
    adminNotes: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settlement', settlementSchema);

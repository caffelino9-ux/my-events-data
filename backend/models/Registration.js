const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    eventName: { type: String, required: true },
    organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    ticketCount: { type: Number, required: true, default: 1 },
    amountPaid: { type: Number, required: true, default: 0 },
    paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Completed' },
    gender: { type: String, enum: ['Male', 'Female', 'Other', 'Not Specified'], default: 'Not Specified' },
    registrationDate: { type: Date, default: Date.now },
    ticketNumber: { type: String, required: true, unique: true },
    checkInStatus: { type: Boolean, default: false },
    qrCodeUrl: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Registration', registrationSchema);

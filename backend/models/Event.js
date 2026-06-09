const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    eventName: { type: String, required: true },
    eventDescription: { type: String, required: true },
    eventCategory: { type: String, required: true },

    bannerUrl: { type: String, required: true },
    bannerPublicId: { type: String, required: true },

    cafeName: { type: String, required: true },
    venueName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pincode: { type: String, required: true },
    googleMapsLink: { type: String },

    eventDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    timezone: { type: String, required: true },

    ticketType: { type: String, enum: ['Free Event', 'Paid Event'], required: true },
    ticketPrice: { type: Number, default: 0 },
    maxSeats: { type: Number, required: true },
    availableSeats: { type: Number, required: true },
    ticketsSold: { type: Number, default: 0 },

    organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    organizerName: { type: String, required: true },
    clubCompanyName: { type: String },
    organizerEmail: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    eventInstagramId: { type: String },

    bankDetailsEncrypted: { type: String },

    status: { type: String, enum: ['draft', 'published', 'cancelled', 'completed'], default: 'published' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);

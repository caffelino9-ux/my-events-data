const Event = require('../models/Event');
const EventDraft = require('../models/EventDraft');
const Registration = require('../models/Registration');
const cloudinary = require('../config/cloudinary');

// Upload Banner to Cloudinary
exports.uploadBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file provided' });
    }

    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'caffelino/events/banner',
    });

    res.status(200).json({
      success: true,
      bannerUrl: result.secure_url,
      bannerPublicId: result.public_id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Save Draft
exports.saveDraft = async (req, res) => {
  try {
    const organizerId = req.cafe.id || req.cafe._id;
    const { draftData, currentStep } = req.body;

    let draft = await EventDraft.findOne({ organizerId });
    if (draft) {
      draft.draftData = draftData;
      draft.currentStep = currentStep;
      await draft.save();
    } else {
      draft = await EventDraft.create({ organizerId, draftData, currentStep });
    }

    res.status(200).json({ success: true, draft });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Draft
exports.getDraft = async (req, res) => {
  try {
    const organizerId = req.cafe.id || req.cafe._id;
    const draft = await EventDraft.findOne({ organizerId });
    res.status(200).json({ success: true, draft });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create Event
exports.createEvent = async (req, res) => {
  try {
    const organizerId = req.cafe.id || req.cafe._id;
    
    // Encrypt bank details simply (In a real app, use crypto or bcrypt)
    const bankDetailsEncrypted = Buffer.from(JSON.stringify(req.body.bankDetails || {})).toString('base64');

    const newEvent = new Event({
      ...req.body,
      organizerId,
      bankDetailsEncrypted,
      status: 'published'
    });

    await newEvent.save();

    // Clear the draft once successfully published
    await EventDraft.findOneAndDelete({ organizerId });

    res.status(201).json({ success: true, event: newEvent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get My Events
exports.getMyEvents = async (req, res) => {
  try {
    const organizerId = req.cafe.id || req.cafe._id;
    const eventsRaw = await Event.find({ organizerId }).sort({ createdAt: -1 });
    
    const events = eventsRaw.map(e => {
      const obj = e.toObject();
      if (obj.bankDetailsEncrypted) {
        try {
          const jsonString = Buffer.from(obj.bankDetailsEncrypted, 'base64').toString('utf8');
          obj.bankDetails = JSON.parse(jsonString);
        } catch (err) {
          console.error("Failed to decode bank details");
        }
      }
      return obj;
    });

    res.status(200).json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Single Event
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    
    const obj = event.toObject();
    if (obj.bankDetailsEncrypted) {
        try {
          const jsonString = Buffer.from(obj.bankDetailsEncrypted, 'base64').toString('utf8');
          obj.bankDetails = JSON.parse(jsonString);
        } catch (err) {
          console.error("Failed to decode bank details");
        }
    }

    res.status(200).json({ success: true, event: obj });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Event
exports.updateEvent = async (req, res) => {
  try {
    const organizerId = req.cafe.id || req.cafe._id;
    const event = await Event.findOne({ _id: req.params.id, organizerId });
    if (!event) return res.status(404).json({ success: false, message: 'Event not found or unauthorized' });

    // Handle Cloudinary update if banner changed
    if (req.body.bannerPublicId && req.body.bannerPublicId !== event.bannerPublicId) {
      await cloudinary.uploader.destroy(event.bannerPublicId);
    }

    if (req.body.bankDetails) {
      req.body.bankDetailsEncrypted = Buffer.from(JSON.stringify(req.body.bankDetails)).toString('base64');
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, event: updatedEvent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Event
exports.deleteEvent = async (req, res) => {
  try {
    const organizerId = req.cafe.id || req.cafe._id;
    const event = await Event.findOne({ _id: req.params.id, organizerId });
    if (!event) return res.status(404).json({ success: false, message: 'Event not found or unauthorized' });

    if (event.bannerPublicId) {
      await cloudinary.uploader.destroy(event.bannerPublicId);
    }

    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Dashboard Stats
exports.getDashboardStats = async (req, res) => {
  try {
    const organizerId = req.cafe.id || req.cafe._id;
    
    // Real MongoDB Aggregation
    const stats = await Event.aggregate([
      { $match: { organizerId: new mongoose.Types.ObjectId(organizerId) } },
      { $group: {
          _id: null,
          totalEvents: { $sum: 1 },
          activeEvents: { $sum: { $cond: [{ $eq: ["$status", "published"] }, 1, 0] } },
          draftEvents: { $sum: { $cond: [{ $eq: ["$status", "draft"] }, 1, 0] } },
          totalTicketsSold: { $sum: "$ticketsSold" },
          totalRevenue: { $sum: { $multiply: ["$ticketsSold", "$ticketPrice"] } }
      }}
    ]);

    const recentEvents = await Event.find({ organizerId }).sort({ createdAt: -1 }).limit(5);

    res.status(200).json({ 
      success: true, 
      stats: stats[0] || { totalEvents: 0, activeEvents: 0, draftEvents: 0, totalTicketsSold: 0, totalRevenue: 0 },
      recentEvents 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Earnings
exports.getEarnings = async (req, res) => {
  try {
    const organizerId = req.cafe.id || req.cafe._id;
    const events = await Event.find({ organizerId, ticketType: 'Paid Event' });
    
    const totalRevenue = events.reduce((acc, ev) => acc + (ev.ticketsSold * ev.ticketPrice), 0);
    
    res.status(200).json({ 
      success: true, 
      totalRevenue,
      pendingSettlements: totalRevenue, // Mocked pending
      completedSettlements: 0, // Mocked completed
      ticketsSold: events.reduce((acc, ev) => acc + ev.ticketsSold, 0)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Registrations
exports.getRegistrations = async (req, res) => {
  try {
    const organizerId = req.cafe.id || req.cafe._id;
    // Fetch all registrations belonging to events managed by this organizer
    const registrations = await Registration.find({ organizerId })
      .populate('eventId', 'eventName bannerUrl')
      .sort({ registrationDate: -1 });

    res.status(200).json({ success: true, registrations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

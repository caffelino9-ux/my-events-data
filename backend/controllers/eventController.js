const Event = require('../models/Event');
const EventDraft = require('../models/EventDraft');
const Registration = require('../models/Registration');
const Settlement = require('../models/Settlement');
const Refund = require('../models/Refund');
const Payment = require('../models/Payment');
const cloudinary = require('../config/cloudinary');
const { Parser } = require('json2csv');

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
    
    // We will attach registration info here
    const events = [];
    for (let e of eventsRaw) {
      const obj = e.toObject();
      if (obj.bankDetailsEncrypted) {
        try {
          const jsonString = Buffer.from(obj.bankDetailsEncrypted, 'base64').toString('utf8');
          obj.bankDetails = JSON.parse(jsonString);
        } catch (err) {
          console.error("Failed to decode bank details");
        }
      }

      // Aggregate registrations data
      const regs = await Registration.find({ eventId: e._id });
      let paidUsers = 0;
      let freeUsers = 0;
      let revenue = 0;
      
      regs.forEach(r => {
        if (r.amountPaid > 0) {
          paidUsers += 1;
          revenue += r.amountPaid;
        } else {
          freeUsers += 1;
        }
      });
      
      const platformFee = revenue * 0.05;
      
      obj.paidUsers = paidUsers;
      obj.freeUsers = freeUsers;
      obj.registrationsCount = regs.length;
      obj.revenue = revenue;
      obj.settlementPending = revenue - platformFee;

      events.push(obj);
    }

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

    // Attach payments and registrations
    const registrations = await Registration.find({ eventId: event._id });
    const payments = await Payment.find({ eventId: event._id }).populate('userId', 'name email');

    res.status(200).json({ success: true, event: obj, registrations, payments });
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
    
    // Auto-sync settlements for this organizer's events
    const events = await Event.find({ organizerId });
    let totalRevenue = 0;
    
    for (const e of events) {
      const regs = await Registration.find({ eventId: e._id });
      let eventRevenue = 0;
      let paidUsers = 0;
      let freeUsers = 0;
      let ticketsSold = 0;

      regs.forEach(r => {
        ticketsSold += (r.ticketCount || 1);
        if (r.amountPaid > 0) {
          paidUsers += 1;
          eventRevenue += r.amountPaid;
        } else {
          freeUsers += 1;
        }
      });
      
      totalRevenue += eventRevenue;

      if (ticketsSold > 0) {
        const platformFeeAmount = eventRevenue * 0.05;
        const amountPayable = eventRevenue - platformFeeAmount;
        
        await Settlement.findOneAndUpdate(
          { eventId: e._id },
          {
            eventId: e._id,
            organizerId: e.organizerId,
            totalRevenue: eventRevenue,
            ticketsSold,
            paidUsers,
            freeUsers,
            platformFeePercentage: 5,
            platformFeeAmount,
            amountPayable,
          },
          { upsert: true, setDefaultsOnInsert: true }
        );
      }
    }

    const settlements = await Settlement.find({ organizerId });
    const pendingSettlements = settlements.filter(s => s.status !== 'Paid').reduce((acc, s) => acc + s.amountPayable, 0);
    const completedSettlements = settlements.filter(s => s.status === 'Paid').reduce((acc, s) => acc + s.amountPayable, 0);

    const allRegs = await Registration.find({ organizerId });
    const totalRegistrations = allRegs.length;
    let totalPaidUsers = 0;
    let totalFreeUsers = 0;
    
    allRegs.forEach(r => {
      if (r.amountPaid > 0) totalPaidUsers++;
      else totalFreeUsers++;
    });

    res.status(200).json({ 
      success: true, 
      totalEvents: events.length,
      totalRegistrations,
      totalPaidUsers,
      totalFreeUsers,
      totalRevenue,
      pendingSettlements,
      completedSettlements
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Settlements
exports.getOrganizerSettlements = async (req, res) => {
  try {
    const organizerId = req.cafe.id || req.cafe._id;
    const settlements = await Settlement.find({ organizerId })
      .populate('eventId', 'eventName eventDate ticketsSold')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, settlements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Refunds
exports.getOrganizerRefunds = async (req, res) => {
  try {
    // const organizerId = req.cafe.id || req.cafe._id;
    // Refunds might be linked to eventId, we would fetch events first
    res.status(200).json({ success: true, refunds: [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Registrations
exports.getRegistrations = async (req, res) => {
  try {
    const organizerId = req.cafe.id || req.cafe._id;
    const registrations = await Registration.find({ organizerId })
      .populate('eventId', 'eventName bannerUrl')
      .sort({ registrationDate: -1 });

    res.status(200).json({ success: true, registrations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CSV Exports
exports.exportSalesCsv = async (req, res) => {
  try {
    const organizerId = req.cafe.id || req.cafe._id;
    const registrations = await Registration.find({ organizerId }).populate('eventId', 'eventName');
    const data = registrations.map(r => ({
      Event: r.eventId?.eventName || r.eventName,
      User: r.userName,
      Email: r.email,
      Phone: r.phone,
      Tickets: r.ticketCount,
      AmountPaid: r.amountPaid,
      Status: r.paymentStatus,
      Date: r.registrationDate
    }));
    const parser = new Parser();
    const csv = parser.parse(data);
    res.header('Content-Type', 'text/csv');
    res.attachment('sales.csv');
    res.send(csv);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.exportSettlementsCsv = async (req, res) => {
  try {
    const organizerId = req.cafe.id || req.cafe._id;
    const settlements = await Settlement.find({ organizerId }).populate('eventId', 'eventName');
    const data = settlements.map(s => ({
      Event: s.eventId?.eventName,
      TotalRevenue: s.totalRevenue,
      PlatformFee: s.platformFeeAmount,
      Payable: s.amountPayable,
      Status: s.status,
      UTR: s.utrNumber,
      Date: s.createdAt
    }));
    const parser = new Parser();
    const csv = parser.parse(data);
    res.header('Content-Type', 'text/csv');
    res.attachment('settlements.csv');
    res.send(csv);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const Cafe = require("../models/Cafe/Cafe_login");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const User = require("../models/User/User");
const Payment = require("../models/Payment");
const Settlement = require("../models/Settlement");
const cloudinary = require('../config/cloudinary');
const { Parser } = require('json2csv');

// Platform Stats
const getPlatformStats = async (req, res) => {
  try {
    const totalOrganizers = await Cafe.countDocuments();
    const verifiedOrganizers = await Cafe.countDocuments({ status: true });
    const totalUsers = await User.countDocuments();
    
    const events = await Event.find();
    const totalEvents = events.length;
    
    // Status counts
    const activeEvents = events.filter(e => e.status === 'published').length;
    const draftEvents = events.filter(e => e.status === 'draft').length;
    const completedEvents = events.filter(e => e.status === 'completed').length;
    const cancelledEvents = events.filter(e => e.status === 'cancelled').length;
    
    // Treat "Pending Review" as Drafts 
    const pendingReviewEvents = draftEvents;
    
    // Upcoming
    const today = new Date();
    const upcomingEvents = events.filter(e => new Date(e.eventDate) > today && e.status !== 'cancelled').length;
    
    let totalTicketsSold = 0;
    let totalRevenue = 0;
    
    events.forEach(e => {
      totalTicketsSold += (e.ticketsSold || 0);
      totalRevenue += ((e.ticketsSold || 0) * (e.ticketPrice || 0));
    });
    
    // Registrations and Time-based revenue
    const allRegs = await Registration.find();
    const totalRegistrations = allRegs.length;
    
    let todaysRevenue = 0;
    let thisMonthRevenue = 0;
    
    const startOfToday = new Date();
    startOfToday.setHours(0,0,0,0);
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    let todaysRegistrations = 0;

    allRegs.forEach(r => {
      const regDate = new Date(r.registrationDate);
      if (regDate >= startOfToday) {
        todaysRevenue += (r.amountPaid || 0);
        todaysRegistrations += 1;
      }
      if (regDate >= startOfMonth) {
        thisMonthRevenue += (r.amountPaid || 0);
      }
    });

    const averageTicketsPerEvent = activeEvents > 0 ? Math.round(totalTicketsSold / activeEvents) : 0;

    // Real pending/completed settlements
    const allSettlements = await Settlement.find();
    let pendingSettlements = 0;
    let completedSettlements = 0;
    allSettlements.forEach(s => {
      if (s.status === 'Paid') completedSettlements += (s.amountPayable || 0);
      else pendingSettlements += (s.amountPayable || 0);
    });

    res.json({
      totalOrganizers,
      verifiedOrganizers,
      totalUsers,
      totalRegistrations,
      totalEvents,
      activeEvents: activeEvents,
      publishedEvents: activeEvents,
      draftEvents,
      completedEvents,
      cancelledEvents,
      pendingReviewEvents,
      upcomingEvents,
      totalTicketsSold,
      totalRevenue,
      todaysRevenue,
      thisMonthRevenue,
      pendingSettlements,
      completedSettlements,
      todaysRegistrations,
      averageTicketsPerEvent
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// All Events
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 }).lean();
    const registrations = await Registration.find().lean();
    
    const enrichedEvents = events.map(e => {
      const eventRegs = registrations.filter(r => r.eventId.toString() === e._id.toString());
      const registrationCount = eventRegs.length;
      const checkInsCount = eventRegs.filter(r => r.checkInStatus).length;
      return {
        ...e,
        registrationCount,
        checkInsCount
      };
    });
    
    res.json(enrichedEvents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Event By Id
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    
    let decodedBankDetails = null;
    if (event.bankDetailsEncrypted) {
      try {
        const jsonString = Buffer.from(event.bankDetailsEncrypted, 'base64').toString('utf8');
        decodedBankDetails = JSON.parse(jsonString);
      } catch (e) {
        console.error("Failed to decode bank details");
      }
    }

    const organizer = await Cafe.findById(event.organizerId);
    const registrations = await Registration.find({ eventId: event._id }).sort({ registrationDate: -1 });
    const payments = await Payment.find({ eventId: event._id }).populate('userId', 'name email');
    
    let maleCount = 0;
    let femaleCount = 0;
    let otherCount = 0;
    let newRegistrationsToday = 0;
    const startOfToday = new Date();
    startOfToday.setHours(0,0,0,0);
    
    registrations.forEach(r => {
      if (r.gender === 'Male') maleCount++;
      else if (r.gender === 'Female') femaleCount++;
      else otherCount++;
      
      if (new Date(r.registrationDate) >= startOfToday) {
        newRegistrationsToday++;
      }
    });

    res.json({
      event: event.toObject(),
      bankDetails: decodedBankDetails,
      organizer,
      registrations,
      payments,
      analytics: {
        maleCount,
        femaleCount,
        otherCount,
        newRegistrationsToday
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// All Organizers
const getAllOrganizers = async (req, res) => {
  try {
    const organizers = await Cafe.find().sort({ createdAt: -1 });
    const events = await Event.find();
    
    // Aggregate data per organizer
    const enrichedOrganizers = organizers.map(org => {
      const orgEvents = events.filter(e => e.organizerId?.toString() === org._id.toString());
      const totalEvents = orgEvents.length;
      let totalRevenue = 0;
      let totalTicketsSold = 0;
      orgEvents.forEach(e => {
        totalTicketsSold += (e.ticketsSold || 0);
        totalRevenue += ((e.ticketsSold || 0) * (e.ticketPrice || 0));
      });
      
      return {
        ...org.toObject(),
        totalEvents,
        totalTicketsSold,
        totalRevenue
      };
    });

    res.json(enrichedOrganizers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// All Registrations
const getAllRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find()
      .populate('eventId', 'eventName bannerUrl')
      .populate('organizerId', 'name email Phonenumber')
      .sort({ registrationDate: -1 });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Event Actions
const updateEventStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const event = await Event.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json({ message: "Event status updated", event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const suspendEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, { status: 'cancelled' }, { new: true });
    res.json({ message: "Event suspended", event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Wipe banner from Cloudinary
    if (event.bannerPublicId) {
      await cloudinary.uploader.destroy(event.bannerPublicId);
    }

    await Event.findByIdAndDelete(req.params.id);
    // Remove related registrations
    await Registration.deleteMany({ eventId: req.params.id });

    res.json({ message: "Event and associated files completely deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Original Cafe Verifications
const approveCafe = async (req, res) => {
  const cafe = await Cafe.findByIdAndUpdate(req.params.id, { status: true }, { new: true });
  if (!cafe) return res.status(404).json({ message: "Cafe not found" });
  res.json({ message: "Cafe approved successfully", cafe });
};

const rejectCafe = async (req, res) => {
  const cafe = await Cafe.findByIdAndDelete(req.params.id);
  if (!cafe) return res.status(404).json({ message: "Cafe not found" });
  res.json({ message: "Cafe rejected and deleted successfully" });
};

const getPendingCafes = async (req, res) => {
  const cafes = await Cafe.find({ status: false });
  res.json(cafes);
};

// Settlements
const getSettlements = async (req, res) => {
  try {
    // Auto-sync settlements for events with sales
    const events = await Event.find();
    for (const e of events) {
      // Get registrations to accurately count free vs paid
      const regs = await Registration.find({ eventId: e._id });
      let paidUsers = 0;
      let freeUsers = 0;
      let totalRevenue = 0;
      let ticketsSold = 0;

      if (regs.length > 0) {
        regs.forEach(r => {
          ticketsSold += (r.ticketCount || 1);
          if (r.amountPaid > 0) {
            paidUsers += 1;
            totalRevenue += r.amountPaid;
          } else {
            freeUsers += 1;
          }
        });
      } else if (e.ticketsSold > 0) {
        ticketsSold = e.ticketsSold;
        totalRevenue = ticketsSold * (e.ticketPrice || 0);
        if (e.ticketPrice > 0) paidUsers = ticketsSold;
        else freeUsers = ticketsSold;
      }

      if (ticketsSold > 0) {
        const platformFeeAmount = totalRevenue * 0.05; // 5% fee
        const amountPayable = totalRevenue - platformFeeAmount;
        
        await Settlement.findOneAndUpdate(
          { eventId: e._id },
          {
            eventId: e._id,
            organizerId: e.organizerId,
            totalRevenue,
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

    const settlements = await Settlement.find()
      .populate('eventId', 'eventName eventDate ticketsSold')
      .populate('organizerId', 'name email_address_manager Phonenumber')
      .sort({ createdAt: -1 });

    res.json(settlements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSettlementStatus = async (req, res) => {
  try {
    const { status, utrNumber, adminNotes } = req.body;
    const updateData = { status };
    if (utrNumber) updateData.utrNumber = utrNumber;
    if (adminNotes) updateData.adminNotes = adminNotes;
    if (status === 'Paid') updateData.paymentDate = new Date();

    const settlement = await Settlement.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ message: "Settlement updated", settlement });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Payments
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('eventId', 'eventName')
      .populate('organizerId', 'name')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CSV Exports
const exportRegistrationsCsv = async (req, res) => {
  try {
    const registrations = await Registration.find().populate('eventId', 'eventName').populate('organizerId', 'name');
    const data = registrations.map(r => ({
      ID: r._id,
      Event: r.eventId?.eventName || r.eventName,
      Organizer: r.organizerId?.name,
      User: r.userName,
      Email: r.email,
      Phone: r.phone,
      Tickets: r.ticketCount,
      AmountPaid: r.amountPaid,
      Status: r.paymentStatus,
      TicketNumber: r.ticketNumber,
      Date: r.registrationDate
    }));
    const parser = new Parser();
    const csv = parser.parse(data);
    res.header('Content-Type', 'text/csv');
    res.attachment('registrations.csv');
    res.send(csv);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const exportPaymentsCsv = async (req, res) => {
  try {
    const payments = await Payment.find().populate('eventId', 'eventName').populate('organizerId', 'name');
    const data = payments.map(p => ({
      TransactionID: p.transactionId,
      Event: p.eventId?.eventName,
      Organizer: p.organizerId?.name,
      Amount: p.amount,
      Currency: p.currency,
      Status: p.status,
      Method: p.paymentMethod,
      Date: p.createdAt
    }));
    const parser = new Parser();
    const csv = parser.parse(data);
    res.header('Content-Type', 'text/csv');
    res.attachment('payments.csv');
    res.send(csv);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const exportSettlementsCsv = async (req, res) => {
  try {
    const settlements = await Settlement.find().populate('eventId', 'eventName').populate('organizerId', 'name');
    const data = settlements.map(s => ({
      SettlementID: s._id,
      Event: s.eventId?.eventName,
      Organizer: s.organizerId?.name,
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

// Revenue Analytics
const getRevenueAnalytics = async (req, res) => {
  try {
    const regs = await Registration.find().lean();
    
    // Group by day for the last 30 days
    const dailyMap = {};
    const today = new Date();
    for(let i=29; i>=0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      dailyMap[key] = 0;
    }
    
    regs.forEach(r => {
      if (r.amountPaid > 0) {
        const d = new Date(r.registrationDate);
        const key = d.toISOString().split('T')[0];
        if (dailyMap[key] !== undefined) {
          dailyMap[key] += r.amountPaid;
        }
      }
    });
    
    const dailyRevenue = Object.keys(dailyMap).map(date => ({ date, revenue: dailyMap[date] }));
    
    res.json({ dailyRevenue });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  getPlatformStats, getAllEvents, getEventById, getAllOrganizers, getAllRegistrations,
  updateEventStatus, suspendEvent, deleteEvent,
  approveCafe, rejectCafe, getPendingCafes,
  getSettlements, updateSettlementStatus, getAllPayments,
  exportRegistrationsCsv, exportPaymentsCsv, exportSettlementsCsv,
  getRevenueAnalytics
};

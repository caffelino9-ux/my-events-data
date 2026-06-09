const Cafe = require("../models/Cafe/Cafe_login");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const User = require("../models/User/User");
const cloudinary = require('../config/cloudinary');

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

    allRegs.forEach(r => {
      const regDate = new Date(r.registrationDate);
      if (regDate >= startOfToday) {
        todaysRevenue += (r.amountPaid || 0);
      }
      if (regDate >= startOfMonth) {
        thisMonthRevenue += (r.amountPaid || 0);
      }
    });

    const pendingSettlements = totalRevenue * 0.9;

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
      pendingSettlements
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// All Events
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
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
    const registrations = await Registration.find({ eventId: event._id });
    
    res.json({
      event: event.toObject(),
      bankDetails: decodedBankDetails,
      organizer,
      registrations
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

// Settlements (Mock logic grabbing events with sold tickets)
const getSettlements = async (req, res) => {
  try {
    const events = await Event.find({ ticketsSold: { $gt: 0 } }).populate('organizerId', 'name');
    const settlements = events.map(e => {
      let decodedBankDetails = null;
      if (e.bankDetailsEncrypted) {
        try {
          const jsonString = Buffer.from(e.bankDetailsEncrypted, 'base64').toString('utf8');
          decodedBankDetails = JSON.parse(jsonString);
        } catch (err) {
          console.error("Failed to decode bank details in settlements");
        }
      }

      const revenue = (e.ticketsSold || 0) * (e.ticketPrice || 0);
      return {
        _id: e._id,
        organizerName: e.organizerName,
        eventName: e.eventName,
        bankDetails: decodedBankDetails,
        amountPayable: revenue * 0.9,
        status: e.status === 'completed' ? 'Paid' : 'Pending'
      };
    });
    res.json(settlements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  getPlatformStats, getAllEvents, getEventById, getAllOrganizers, getAllRegistrations,
  updateEventStatus, suspendEvent, deleteEvent,
  approveCafe, rejectCafe, getPendingCafes,
  getSettlements
};

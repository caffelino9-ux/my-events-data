const express = require("express");
const router = express.Router();
const { 
  getPlatformStats, getAllEvents, getEventById, getAllOrganizers, getAllRegistrations,
  updateEventStatus, suspendEvent, deleteEvent,
  approveCafe, rejectCafe, getPendingCafes,
  getSettlements
} = require("../controllers/admin.controller");

// Dashboard
router.get("/test", (req, res) => res.json({ msg: "admin routes work" }));
router.get("/dashboard-stats", getPlatformStats);

// Events
router.get("/events", getAllEvents);
router.get("/event/:id", getEventById);
router.put("/event/:id/status", updateEventStatus);
router.put("/event/:id/suspend", suspendEvent);
router.delete("/event/:id", deleteEvent);

// Organizers
router.get("/organizers", getAllOrganizers);

// Registrations
router.get("/registrations", getAllRegistrations);

// Settlements
router.get("/settlements", getSettlements);

// Verifications
router.get("/get/cafe", getPendingCafes);
router.put("/approve-cafe/:id", approveCafe);
router.delete("/reject-cafe/:id", rejectCafe);

module.exports = router;

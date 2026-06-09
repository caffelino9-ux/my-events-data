const express = require("express");
const router = express.Router();
const { 
  getPlatformStats, getAllEvents, getEventById, getAllOrganizers, getAllRegistrations,
  updateEventStatus, suspendEvent, deleteEvent,
  approveCafe, rejectCafe, getPendingCafes,
  getSettlements, updateSettlementStatus, getAllPayments,
  exportRegistrationsCsv, exportPaymentsCsv, exportSettlementsCsv
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

// Registrations & Payments
router.get("/registrations", getAllRegistrations);
router.get("/payments", getAllPayments);

// Settlements
router.get("/settlements", getSettlements);
router.put("/settlement/:id/status", updateSettlementStatus);

// CSV Exports
router.get("/export/registrations", exportRegistrationsCsv);
router.get("/export/payments", exportPaymentsCsv);
router.get("/export/settlements", exportSettlementsCsv);

// Verifications
router.get("/get/cafe", getPendingCafes);
router.put("/approve-cafe/:id", approveCafe);
router.delete("/reject-cafe/:id", rejectCafe);

module.exports = router;

const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const upload = require('../middlewares/upload');
const authCafe = require('../middlewares/authCafe');

// All event routes are protected by authCafe middleware
router.use(authCafe);

// Cloudinary Banner Upload
router.post('/upload-banner', upload.single('banner'), eventController.uploadBanner);

// Drafts
router.post('/save-draft', eventController.saveDraft);
router.get('/draft', eventController.getDraft);

// Event CRUD
router.post('/create', eventController.createEvent);
router.get('/my-events', eventController.getMyEvents);
router.put('/update/:id', eventController.updateEvent);
router.delete('/delete/:id', eventController.deleteEvent);

// Dashboard & Analytics
router.get('/dashboard', eventController.getDashboardStats);
router.get('/earnings', eventController.getEarnings);
router.get('/registrations', eventController.getRegistrations);

// Get single event
router.get('/:id', eventController.getEventById);

module.exports = router;

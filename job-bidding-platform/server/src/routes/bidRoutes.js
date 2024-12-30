const express = require('express');
const router = express.Router();
const bidController = require('../controllers/bidController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes are protected by authMiddleware
router.use(authMiddleware);

// Create a new bid
router.post('/bids', bidController.createBid);

// Get all bids for a specific job
router.get('/jobs/:jobId/bids', bidController.getBidsByJobId);

// Get all bids for the current user
router.get('/bids/my-bids', bidController.getMyBids);

// Update bid status (for employers)
router.patch('/bids/:bidId/status', bidController.updateBidStatus);

module.exports = router;

const express = require('express');
const router = express.Router();
const bidController = require('../controllers/bidController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes are protected by authMiddleware
router.use(authMiddleware);

// Get all bids for the current user
router.get('/my-bids', bidController.getMyBids);

// Create a new bid
router.post('/', bidController.createBid);

// Get all bids for a specific job
router.get('/jobs/:jobId/bids', bidController.getBidsByJobId);

// Update bid status (for employers)
router.patch('/:bidId/status', bidController.updateBidStatus);

module.exports = router;

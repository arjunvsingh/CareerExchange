const express = require('express');
const router = express.Router();
const bidController = require('../controllers/bidController');

// Get all bids for a specific job
router.get('/jobs/:jobId/bids', bidController.getBidsByJobId);

// Get all bids for the current applicant
router.get('/my-bids', bidController.getMyBids);

// Create a new bid
router.post('/jobs/:jobId/bids', bidController.createBid);

// Update bid status
router.patch('/jobs/:jobId/bids/:bidId/status', bidController.updateBidStatus);

// Get specific bid details
router.get('/jobs/:jobId/bids/:bidId', bidController.getBidDetails);

module.exports = router;

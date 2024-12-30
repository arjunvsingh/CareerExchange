const Bid = require('../models/Bid');

const bidController = {
  async createBid(req, res) {
    try {
      const { job_id, rate, proposal, availability } = req.body;
      const user_id = req.user.id;

      // Validate required fields
      if (!job_id || !rate || !proposal || !availability) {
        return res.status(400).json({
          success: false,
          error: 'Please provide all required fields'
        });
      }

      const bid = await Bid.create({
        job_id,
        user_id,
        rate,
        proposal,
        availability
      });

      res.status(201).json({
        success: true,
        data: bid
      });
    } catch (error) {
      console.error('Error creating bid:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create bid'
      });
    }
  },

  async getBidsByJobId(req, res) {
    try {
      const { jobId } = req.params;
      const bids = await Bid.findByJobId(jobId);

      res.json({
        success: true,
        data: bids
      });
    } catch (error) {
      console.error('Error fetching bids:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch bids'
      });
    }
  },

  async getMyBids(req, res) {
    try {
      const userId = req.user.id;
      const bids = await Bid.findByUserId(userId);

      res.json({
        success: true,
        data: bids
      });
    } catch (error) {
      console.error('Error fetching user bids:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch your bids'
      });
    }
  },

  async updateBidStatus(req, res) {
    try {
      const { bidId } = req.params;
      const { status } = req.body;

      if (!['pending', 'accepted', 'rejected'].includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid status'
        });
      }

      const bid = await Bid.updateStatus(bidId, status);

      res.json({
        success: true,
        data: bid
      });
    } catch (error) {
      console.error('Error updating bid status:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update bid status'
      });
    }
  }
};

module.exports = bidController;

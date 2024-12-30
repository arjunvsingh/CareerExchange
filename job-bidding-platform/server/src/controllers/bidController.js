const db = require('../config/database');

const bidController = {
  // Get all bids for a specific job
  async getBidsByJobId(req, res, next) {
    try {
      const { jobId } = req.params;
      const query = `
        SELECT b.*, u.name as applicant_name 
        FROM bids b
        JOIN users u ON b.user_id = u.id
        WHERE b.job_id = $1
        ORDER BY b.created_at DESC
      `;
      const result = await db.query(query, [jobId]);
      res.json({ success: true, data: result.rows });
    } catch (error) {
      next(error);
    }
  },

  // Get all bids for the current applicant
  async getMyBids(req, res, next) {
    try {
      const userId = req.user.id; // This will come from auth middleware
      const query = `
        SELECT b.*, j.title as job_title, j.company as job_company
        FROM bids b
        JOIN jobs j ON b.job_id = j.id
        WHERE b.user_id = $1
        ORDER BY b.created_at DESC
      `;
      const result = await db.query(query, [userId]);
      res.json({ success: true, data: result.rows });
    } catch (error) {
      next(error);
    }
  },

  // Create a new bid
  async createBid(req, res, next) {
    try {
      const { jobId } = req.params;
      const userId = req.user.id; // This will come from auth middleware
      const { rate, proposal, availability } = req.body;

      // Validate input
      if (!rate || !proposal || !availability) {
        return res.status(400).json({
          success: false,
          error: 'Rate, proposal, and availability are required'
        });
      }

      const query = `
        INSERT INTO bids (job_id, user_id, rate, proposal, availability)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      const values = [jobId, userId, rate, proposal, availability];
      const result = await db.query(query, values);

      res.status(201).json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      next(error);
    }
  },

  // Update bid status
  async updateBidStatus(req, res, next) {
    try {
      const { jobId, bidId } = req.params;
      const { status } = req.body;

      if (!['pending', 'accepted', 'rejected'].includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid status'
        });
      }

      const query = `
        UPDATE bids
        SET status = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2 AND job_id = $3
        RETURNING *
      `;
      const result = await db.query(query, [status, bidId, jobId]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Bid not found'
        });
      }

      res.json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      next(error);
    }
  },

  // Get specific bid details
  async getBidDetails(req, res, next) {
    try {
      const { jobId, bidId } = req.params;
      const query = `
        SELECT b.*, u.name as applicant_name, j.title as job_title
        FROM bids b
        JOIN users u ON b.user_id = u.id
        JOIN jobs j ON b.job_id = j.id
        WHERE b.id = $1 AND b.job_id = $2
      `;
      const result = await db.query(query, [bidId, jobId]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Bid not found'
        });
      }

      res.json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = bidController;

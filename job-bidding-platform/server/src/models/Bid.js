const db = require('../config/database');

class Bid {
  static async create(bidData) {
    const { job_id, user_id, rate, proposal, availability } = bidData;
    
    const query = `
      INSERT INTO bids (job_id, user_id, rate, proposal, availability, status, created_at)
      VALUES ($1, $2, $3, $4, $5, 'pending', NOW())
      RETURNING *
    `;
    
    const values = [job_id, user_id, rate, proposal, availability];
    
    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error('Failed to create bid: ' + error.message);
    }
  }

  static async findByJobId(jobId) {
    const query = `
      SELECT b.*, u.name as applicant_name
      FROM bids b
      JOIN users u ON b.user_id = u.id
      WHERE b.job_id = $1
      ORDER BY b.created_at DESC
    `;
    
    try {
      const result = await db.query(query, [jobId]);
      return result.rows;
    } catch (error) {
      throw new Error('Failed to fetch bids: ' + error.message);
    }
  }

  static async findByUserId(userId) {
    const query = `
      SELECT b.*, j.title as job_title, j.company
      FROM bids b
      JOIN jobs j ON b.job_id = j.id
      WHERE b.user_id = $1
      ORDER BY b.created_at DESC
    `;
    
    try {
      const result = await db.query(query, [userId]);
      return result.rows;
    } catch (error) {
      throw new Error('Failed to fetch user bids: ' + error.message);
    }
  }

  static async updateStatus(bidId, status) {
    const query = `
      UPDATE bids
      SET status = $1
      WHERE id = $2
      RETURNING *
    `;
    
    try {
      const result = await db.query(query, [status, bidId]);
      return result.rows[0];
    } catch (error) {
      throw new Error('Failed to update bid status: ' + error.message);
    }
  }
}

module.exports = Bid;

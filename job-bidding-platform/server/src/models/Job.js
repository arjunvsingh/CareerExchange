const db = require('../config/database');

class Job {
  static async create(jobData) {
    const { title, company, description, skills, timeline, requirements } = jobData;
    
    const query = `
      INSERT INTO jobs (title, company, description, skills, timeline, requirements)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const values = [title, company, description, skills, timeline, requirements];
    
    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error('Error creating job posting');
    }
  }

  static async findAll() {
    const query = 'SELECT * FROM jobs ORDER BY created_at DESC';
    
    try {
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      throw new Error('Error fetching jobs');
    }
  }

  static async findById(id) {
    const query = 'SELECT * FROM jobs WHERE id = $1';
    
    try {
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error('Error fetching job');
    }
  }

  static async update(id, jobData) {
    const { title, company, description, skills, timeline, requirements } = jobData;
    
    const query = `
      UPDATE jobs
      SET title = $1, company = $2, description = $3, skills = $4, 
          timeline = $5, requirements = $6
      WHERE id = $7
      RETURNING *
    `;
    
    const values = [title, company, description, skills, timeline, requirements, id];
    
    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error('Error updating job posting');
    }
  }
}

module.exports = Job;
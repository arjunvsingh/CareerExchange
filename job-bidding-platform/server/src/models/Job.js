const db = require('../config/database');

class Job {
  static async create(jobData) {
    const { title, company, description, skills, timeline, requirements, employer_id } = jobData;
    
    // Validate required fields
    if (!title || !company || !description || !skills || !timeline || !employer_id) {
      throw new Error('Missing required fields');
    }

    const query = `
      INSERT INTO jobs (title, company, description, skills, timeline, requirements, employer_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    
    const values = [
      title.trim(),
      company.trim(),
      description.trim(),
      skills.trim(),
      timeline.trim(),
      requirements ? requirements.trim() : null,
      employer_id
    ];
    
    try {
      console.log('Creating new job with data:', { ...jobData, requirements: 'truncated' });
      const result = await db.query(query, values);
      console.log('Job created successfully:', result.rows[0].id);
      return result.rows[0];
    } catch (error) {
      console.error('Error in Job.create:', error);
      throw error;
    }
  }

  static async findAll() {
    const query = `
      SELECT j.*, u.name as employer_name,
             COUNT(DISTINCT b.id) as total_bids
      FROM jobs j
      JOIN users u ON j.employer_id = u.id
      LEFT JOIN bids b ON j.id = b.job_id
      GROUP BY j.id, u.name
      ORDER BY j.created_at DESC
    `;
    
    try {
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error in Job.findAll:', error);
      throw error;
    }
  }

  static async findById(id) {
    // Ensure id is a number and valid
    const jobId = parseInt(id);
    if (isNaN(jobId) || jobId <= 0) {
      throw new Error('Invalid job ID');
    }

    const query = `
      SELECT j.*, u.name as employer_name,
             COUNT(DISTINCT b.id) as total_bids
      FROM jobs j
      JOIN users u ON j.employer_id = u.id
      LEFT JOIN bids b ON j.id = b.job_id
      WHERE j.id = $1
      GROUP BY j.id, u.name
    `;
    
    try {
      const result = await db.query(query, [jobId]);
      return result.rows[0] || null; // Return null if no job found
    } catch (error) {
      console.error('Error in Job.findById:', error);
      throw error;
    }
  }

  static async findByEmployerId(employerId) {
    const query = `
      SELECT j.*, u.name as employer_name,
             COUNT(DISTINCT b.id) as total_bids
      FROM jobs j
      JOIN users u ON j.employer_id = u.id
      LEFT JOIN bids b ON j.id = b.job_id
      WHERE j.employer_id = $1
      GROUP BY j.id, u.name
      ORDER BY j.created_at DESC
    `;
    
    try {
      const result = await db.query(query, [employerId]);
      return result.rows;
    } catch (error) {
      console.error('Error in Job.findByEmployerId:', error);
      throw error;
    }
  }

  static async update(id, jobData) {
    // Ensure id is a number and valid
    const jobId = parseInt(id);
    if (isNaN(jobId) || jobId <= 0) {
      throw new Error('Invalid job ID');
    }

    const { title, company, description, skills, timeline, requirements } = jobData;
    
    const query = `
      UPDATE jobs
      SET title = $1, 
          company = $2, 
          description = $3, 
          skills = $4, 
          timeline = $5, 
          requirements = $6,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *
    `;
    
    const values = [
      title.trim(),
      company.trim(),
      description.trim(),
      skills.trim(),
      timeline.trim(),
      requirements ? requirements.trim() : null,
      jobId
    ];
    
    try {
      const result = await db.query(query, values);
      if (result.rows.length === 0) {
        return null; // Return null if no job found
      }
      return result.rows[0];
    } catch (error) {
      console.error('Error in Job.update:', error);
      throw error;
    }
  }

  static async delete(id) {
    const query = `
      DELETE FROM jobs
      WHERE id = $1
      RETURNING id
    `;
    
    try {
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error in Job.delete:', error);
      throw error;
    }
  }
}

module.exports = Job;
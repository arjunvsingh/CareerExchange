const db = require('../config/database');

class Job {
  static async create(jobData) {
    const { title, company, description, skills, timeline, requirements } = jobData;
    
    // Validate required fields
    if (!title || !company || !description || !skills || !timeline) {
      throw new Error('Missing required fields');
    }

    const query = `
      INSERT INTO jobs (title, company, description, skills, timeline, requirements)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const values = [
      title.trim(),
      company.trim(),
      description.trim(),
      skills.trim(),
      timeline.trim(),
      requirements ? requirements.trim() : null
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
      SELECT * FROM jobs 
      ORDER BY created_at DESC
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
    if (!id || isNaN(id)) {
      throw new Error('Invalid job ID');
    }

    const query = 'SELECT * FROM jobs WHERE id = $1';
    
    try {
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error in Job.findById:', error);
      throw error;
    }
  }

  static async update(id, jobData) {
    if (!id || isNaN(id)) {
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
      id
    ];
    
    try {
      const result = await db.query(query, values);
      if (result.rows.length === 0) {
        throw new Error('Job not found');
      }
      return result.rows[0];
    } catch (error) {
      console.error('Error in Job.update:', error);
      throw error;
    }
  }
}

module.exports = Job;
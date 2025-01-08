const Job = require('../models/Job');

const validateJobData = (jobData) => {
  const { title, company, description, skills, timeline } = jobData;
  
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    throw new Error('Title is required');
  }
  if (!company || typeof company !== 'string' || company.trim().length === 0) {
    throw new Error('Company is required');
  }
  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    throw new Error('Description is required');
  }
  if (!skills || typeof skills !== 'string' || skills.trim().length === 0) {
    throw new Error('Skills are required');
  }
  if (!timeline || typeof timeline !== 'string' || timeline.trim().length === 0) {
    throw new Error('Timeline is required');
  }
};

const jobController = {
  // Create a new job posting
  async createJob(req, res, next) {
    try {
      const jobData = {
        ...req.body,
        employer_id: req.user.id // Add employer_id from authenticated user
      };
      validateJobData(jobData);
      
      // Trim whitespace from string fields
      Object.keys(jobData).forEach(key => {
        if (typeof jobData[key] === 'string') {
          jobData[key] = jobData[key].trim();
        }
      });

      const newJob = await Job.create(jobData);
      res.status(201).json({
        success: true,
        data: newJob
      });
    } catch (error) {
      next(error);
    }
  },

  // Get all job postings
  async getAllJobs(req, res, next) {
    try {
      const jobs = await Job.findAll();
      res.status(200).json({
        success: true,
        data: jobs
      });
    } catch (error) {
      next(error);
    }
  },

  // Get jobs posted by the current employer
  async getMyPostedJobs(req, res, next) {
    try {
      if (!req.user || req.user.role !== 'employer') {
        return res.status(403).json({
          success: false,
          error: 'Only employers can access their posted jobs'
        });
      }

      const jobs = await Job.findByEmployerId(req.user.id);
      res.status(200).json({
        success: true,
        data: jobs
      });
    } catch (error) {
      next(error);
    }
  },

  // Get a single job posting
  async getJobById(req, res, next) {
    try {
      const { id } = req.params;
      
      // Validate id format
      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
          success: false,
          error: 'Invalid job ID format'
        });
      }

      try {
        const job = await Job.findById(parseInt(id));
        
        if (!job) {
          return res.status(404).json({
            success: false,
            error: 'Job not found'
          });
        }

        res.status(200).json({
          success: true,
          data: job
        });
      } catch (error) {
        if (error.message === 'Invalid job ID') {
          return res.status(400).json({
            success: false,
            error: 'Invalid job ID format'
          });
        }
        throw error;
      }
    } catch (error) {
      next(error);
    }
  },

  // Update a job posting
  async updateJob(req, res, next) {
    try {
      const { id } = req.params;
      const jobData = req.body;
      validateJobData(jobData);

      const updatedJob = await Job.update(id, jobData);

      if (!updatedJob) {
        return res.status(404).json({
          success: false,
          error: 'Job not found'
        });
      }

      res.status(200).json({
        success: true,
        data: updatedJob
      });
    } catch (error) {
      next(error);
    }
  },

  // Delete a job posting
  async deleteJob(req, res, next) {
    try {
      const { id } = req.params;
      const jobId = parseInt(id);

      // Validate id format
      if (!jobId || isNaN(jobId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid job ID format'
        });
      }

      // Check if job exists and belongs to the current user
      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).json({
          success: false,
          error: 'Job not found'
        });
      }

      // Verify ownership
      if (job.employer_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to delete this job'
        });
      }

      // Delete the job
      await Job.delete(jobId);

      res.status(200).json({
        success: true,
        message: 'Job deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = jobController;
const Job = require('../models/Job');

const jobController = {
  // Create a new job posting
  async createJob(req, res, next) {
    try {
      const jobData = req.body;
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

  // Get a single job posting
  async getJobById(req, res, next) {
    try {
      const { id } = req.params;
      const job = await Job.findById(id);
      
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
      next(error);
    }
  },

  // Update a job posting
  async updateJob(req, res, next) {
    try {
      const { id } = req.params;
      const jobData = req.body;
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
  }
};

module.exports = jobController;
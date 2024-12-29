const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

// POST /api/jobs - Create a new job
router.post('/', jobController.createJob);

// GET /api/jobs - Get all jobs
router.get('/', jobController.getAllJobs);

// GET /api/jobs/:id - Get a specific job
router.get('/:id', jobController.getJobById);

// PUT /api/jobs/:id - Update a job
router.put('/:id', jobController.updateJob);

module.exports = router;
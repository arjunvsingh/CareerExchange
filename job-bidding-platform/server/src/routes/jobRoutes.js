const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const authMiddleware = require('../middleware/authMiddleware');

// Protected routes (require authentication)
router.use(authMiddleware);
router.post('/', jobController.createJob);
router.get('/my-posts', jobController.getMyPostedJobs);
router.put('/:id', jobController.updateJob);
router.delete('/:id', jobController.deleteJob);

// Public routes
router.get('/', jobController.getAllJobs);
router.get('/:id', jobController.getJobById);

module.exports = router;
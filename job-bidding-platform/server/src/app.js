const express = require('express');
const cors = require('cors');
const jobRoutes = require('./routes/jobRoutes');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from the Vite dev server
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/jobs', jobRoutes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
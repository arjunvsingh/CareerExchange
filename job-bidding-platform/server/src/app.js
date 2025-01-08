const express = require('express');
const cors = require('cors');
const corsOptions =  {
  origin : [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'https://careerexchange.onrender.com',
    'https://career-exchange.onrender.com',
    'https://careerexchange-api.onrender.com',
    process.env.CLIENT_URL
  ].filter(Boolean),
  credentials : true,
  optionSuccessStatus : 200
}
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint for Render 
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/bids', require('./routes/bidRoutes'));

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '../../client/dist');
  
  app.use(express.static(clientBuildPath));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Don't expose error details in production
  const error = process.env.NODE_ENV === 'production' 
    ? 'Internal Server Error' 
    : err.message || 'Something went wrong!';
  
  res.status(err.status || 500).json({ error });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
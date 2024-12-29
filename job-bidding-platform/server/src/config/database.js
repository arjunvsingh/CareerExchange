const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test the connection and create tables if they don't exist
const initializeDatabase = async () => {
  try {
    const client = await pool.connect();
    console.log('Database connected successfully');

    // Create tables if they don't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        company VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        skills TEXT NOT NULL,
        timeline VARCHAR(255) NOT NULL,
        requirements TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS bids (
        id SERIAL PRIMARY KEY,
        job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL,
        rate DECIMAL NOT NULL,
        proposal TEXT NOT NULL,
        availability VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Database tables initialized');
    client.release();
  } catch (err) {
    console.error('Database initialization error:', err);
    throw err;
  }
};

// Initialize database on startup
initializeDatabase().catch(console.error);

// Export a function that wraps the query with error handling
module.exports = {
  query: async (text, params) => {
    const client = await pool.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } catch (err) {
      console.error('Database query error:', err);
      throw err;
    } finally {
      client.release();
    }
  },
  pool
};
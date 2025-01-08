const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test the connection and create tables if they don't exist
const initializeDatabase = async () => {
  const client = await pool.connect();
  try {
    // Create tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('employer', 'applicant')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS jobs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        company VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        skills TEXT NOT NULL,
        timeline VARCHAR(255) NOT NULL,
        requirements TEXT,
        employer_id INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS bids (
        id SERIAL PRIMARY KEY,
        job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id),
        rate DECIMAL NOT NULL,
        proposal TEXT NOT NULL,
        availability VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Only create default users in development
    if (process.env.NODE_ENV !== 'production') {
      const defaultPassword = 'password123';
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);

      // Check if default users exist
      const existingUsers = await client.query(
        'SELECT email FROM users WHERE email IN ($1, $2)',
        ['employer@test.com', 'applicant@test.com']
      );

      if (existingUsers.rows.length < 2) {
        // Insert default users if they don't exist
        await client.query(`
          INSERT INTO users (name, email, password, role)
          VALUES 
            ('Test Employer', 'employer@test.com', $1, 'employer'),
            ('Test Applicant', 'applicant@test.com', $1, 'applicant')
          ON CONFLICT (email) DO NOTHING;
        `, [hashedPassword]);
        console.log('Default users created');
      }
    }

    console.log('Database tables initialized');
    client.release();
  } catch (err) {
    console.error('Database initialization error:', err);
    throw err;
  }
}

module.exports = pool;
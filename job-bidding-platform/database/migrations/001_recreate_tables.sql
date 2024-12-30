-- Drop existing tables if they exist
DROP TABLE IF EXISTS bids;
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('employer', 'applicant')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create jobs table
CREATE TABLE jobs (
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

-- Create bids table
CREATE TABLE bids (
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

-- Insert default users
INSERT INTO users (name, email, password, role) VALUES 
('Test Employer', 'employer@test.com', '$2b$10$xhbHGBMZGJHRuWCzuUkGxOzJ1H.Ml8LgrH7nwZEz8nfWUKNUXhJSa', 'employer'),
('Test Applicant', 'applicant@test.com', '$2b$10$xhbHGBMZGJHRuWCzuUkGxOzJ1H.Ml8LgrH7nwZEz8nfWUKNUXhJSa', 'applicant'); 
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('employer', 'applicant')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create default users for testing
-- password123 hashed with bcrypt
INSERT INTO users (name, email, password, role) VALUES
('Test Employer', 'employer@test.com', '$2b$10$xhbHGBMZGJHRuWCzuUkGxOzJ1H.Ml8LgrH7nwZEz8nfWUKNUXhJSa', 'employer'),
('Test Applicant', 'applicant@test.com', '$2b$10$xhbHGBMZGJHRuWCzuUkGxOzJ1H.Ml8LgrH7nwZEz8nfWUKNUXhJSa', 'applicant'); 
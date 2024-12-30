-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

-- Insert default users only if they don't exist
DO $$
BEGIN
    -- Try to insert employer
    IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'employer@test.com') THEN
        INSERT INTO users (name, email, password, role)
        VALUES (
            'Test Employer',
            'employer@test.com',
            '$2b$10$5QqLyHhx6AtPMvhC9b6speZxQXqxE3RMObp0q3.yQhQxsR.fLKO2e', -- password: test123
            'employer'
        );
    END IF;

    -- Try to insert applicant
    IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'applicant@test.com') THEN
        INSERT INTO users (name, email, password, role)
        VALUES (
            'Test Applicant',
            'applicant@test.com',
            '$2b$10$5QqLyHhx6AtPMvhC9b6speZxQXqxE3RMObp0q3.yQhQxsR.fLKO2e', -- password: test123
            'applicant'
        );
    END IF;
END $$; 
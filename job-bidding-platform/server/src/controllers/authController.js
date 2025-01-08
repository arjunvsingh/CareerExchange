const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const DEFAULT_PASSWORD = process.env.NODE_ENV === 'production' ? undefined : 'password123';

const authController = {
  // Login user
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // For development, allow login with default credentials
      if (process.env.NODE_ENV !== 'production' && 
          (email === 'employer@test.com' || email === 'applicant@test.com')) {
        console.log('Default credentials used');
        if (password === DEFAULT_PASSWORD) {
          const query = 'SELECT * FROM users WHERE email = $1';
          const result = await db.query(query, [email]);
          const user = result.rows[0];

          const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
          );

          return res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token
          });
        }
      }

      const query = 'SELECT * FROM users WHERE email = $1';
      const result = await db.query(query, [email]);

      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const user = result.rows[0];
      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Register new user
  async register(req, res, next) {
    try {
      console.log('Registration request received:', { ...req.body, password: '[REDACTED]' });
      
      const { name, email, password, role } = req.body;

      // Validate input
      if (!name || !email || !password || !role) {
        console.error('Missing required fields:', { name: !!name, email: !!email, password: !!password, role: !!role });
        return res.status(400).json({ error: 'All fields are required' });
      }

      if (!['employer', 'applicant'].includes(role)) {
        console.error('Invalid role:', role);
        return res.status(400).json({ error: 'Invalid role' });
      }

      // Check if user already exists
      console.log('Checking for existing user with email:', email);
      const existingUser = await db.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      if (existingUser.rows.length > 0) {
        console.log('User already exists with email:', email);
        return res.status(400).json({ error: 'Email already registered' });
      }

      // Hash password
      console.log('Hashing password...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Insert new user
      console.log('Inserting new user...');
      const result = await db.query(
        'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
        [name, email, hashedPassword, role]
      );

      const user = result.rows[0];
      console.log('User created successfully:', { id: user.id, email: user.email, role: user.role });

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
      });
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error stack:', error.stack);
      next(error); // Pass error to error handler middleware
    }
  },

  // Verify JWT token
  async verifyToken(req, res) {
    try {
      const { token } = req.body;
      const decoded = jwt.verify(token, JWT_SECRET);
      res.json({ valid: true, user: decoded });
    } catch (error) {
      res.json({ valid: false });
    }
  },

  // Logout (client-side only for now)
  async logout(req, res) {
    res.json({ success: true });
  }
};

module.exports = authController; 
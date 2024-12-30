const { Pool } = require('pg');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function runMigrations() {
  try {
    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || 'job_bidding_db';
    const createDbQuery = `
      SELECT 'CREATE DATABASE ${dbName}'
      WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${dbName}');
    `;
    
    await pool.query(createDbQuery);

    // Get all migration files
    const migrationsPath = path.join(__dirname, '../../database/migrations');
    const files = await fs.readdir(migrationsPath);
    
    // Filter and sort SQL files
    const migrations = files
      .filter(file => file.endsWith('.sql'))
      .sort();

    // Run each migration
    for (const migration of migrations) {
      console.log(`Running migration: ${migration}`);
      const filePath = path.join(migrationsPath, migration);
      const sql = await fs.readFile(filePath, 'utf-8');
      
      await pool.query(sql);
      console.log(`Completed migration: ${migration}`);
    }

    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrations(); 
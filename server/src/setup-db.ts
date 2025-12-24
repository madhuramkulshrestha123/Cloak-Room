import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database configuration
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '12345678',
  database: process.env.DB_NAME || 'cloakroom',
});

const initializeSchema = async () => {
  try {
    const schemaPath = path.join(__dirname, 'config', 'schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    const client = await pool.connect();
    await client.query(schemaSQL);
    client.release();
    
    console.log('Database schema initialized successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error initializing database schema:', err);
    process.exit(1);
  }
};

initializeSchema();
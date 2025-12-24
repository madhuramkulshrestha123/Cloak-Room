import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Build the path to the schema file - look in the src directory during development
// and in the parent directory when compiled to dist
const schemaPath = path.join(__dirname, '../config/schema.sql');
const schemaPathDev = path.join(__dirname, 'schema.sql');

let actualSchemaPath = schemaPath;
if (!fs.existsSync(schemaPath)) {
  actualSchemaPath = schemaPathDev;
}

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '12345678',
  database: process.env.DB_NAME || 'cloakroom',
});

// Initialize database schema
const initializeSchema = async () => {
  try {
    if (!fs.existsSync(actualSchemaPath)) {
      console.log('Schema file not found at:', actualSchemaPath);
      return;
    }
    
    const schemaSQL = fs.readFileSync(actualSchemaPath, 'utf8');
    
    const client = await pool.connect();
    await client.query(schemaSQL);
    client.release();
    
    console.log('Database schema initialized successfully');
  } catch (err) {
    console.error('Error initializing database schema:', err);
  }
};

// Test the connection and initialize schema
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
  initializeSchema();
});

pool.on('error', (err) => {
  console.error('PostgreSQL connection error:', err);
});

export default pool;
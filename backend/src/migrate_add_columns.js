const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'vibecraft',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

async function migrate() {
  try {
    const client = await pool.connect();
    console.log('Connected to database...');

    try {
        await client.query(`ALTER TABLE proposals ADD COLUMN IF NOT EXISTS venue TEXT;`);
        console.log('Added venue column.');
    } catch (e) {
        console.log('Venue column usage error (might exist):', e.message);
    }

    try {
        await client.query(`ALTER TABLE proposals ADD COLUMN IF NOT EXISTS host TEXT;`);
        console.log('Added host column.');
    } catch (e) {
        console.log('Host column usage error (might exist):', e.message);
    }

    client.release();
    console.log('Migration complete.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await pool.end();
  }
}

migrate();

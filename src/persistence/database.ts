import { Pool } from 'pg';
import { config } from "../config/config";


const pool = new Pool({
  user: config.DB_USER,
  host: config.DB_HOST,
  database: config.DB_NAME,
  password: config.DB_PASSWORD,
  port: config.DB_PORT,
});


async function verifyConnection(): Promise<void> {
  try {
   
    const client = await pool.connect();
    console.log('Connected to PostgreSQL database');
    client.release(); 
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}


verifyConnection();


export default pool;
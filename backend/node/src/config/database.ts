import { Pool } from 'pg';
import 'dotenv/config';

export const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDBNAME,
    password: process.env.PGPASSWORD,
    port: 5432
});

pool.query('SELECT NOW()', (err) => {
    if (err) {
        console.error("Database connection error:", err);
    } else {
        console.log('Database connection successful');
    }
});

import express, { Request, Response, Router } from 'express';
import { Pool } from 'pg';
import cors from 'cors';
import 'dotenv/config';
import ausOpenFinals from './routes/ausOpenFinals.js'

const app = express();
app.use(cors());
app.use(express.json());

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

const PORT = process.env.PORT || 5000;

app.get("/", async (req: Request, res: Response) => {
    res.send("Hello World");
});

app.use('/api/ausopenfinals', ausOpenFinals);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

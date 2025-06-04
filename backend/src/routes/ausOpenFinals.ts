import express, { Request, Response, Router } from 'express'
import { pool } from '../index.js';

const router: Router = express.Router();

router.get('/aomenssinglesfinals', async (req: Request, res: Response) => {
    try {

        const data = await pool.query('SELECT * FROM aus_open_mens_singles ORDER BY year DESC');
        res.json(data.rows);

    } catch (error: unknown) {
        console.error('Database error:', error);
        res.status(500).json({ error: "Error fetching aus open mens singles finals data" });
    }
});

router.get('/aomensdoublesfinals', async (req: Request, res: Response) => {
    try {

        const data = await pool.query('SELECT * FROM aus_open_mens_doubles ORDER BY year DESC');
        res.json(data.rows);

    } catch (error: unknown) {
        console.error('Database error:', error);
        res.status(500).json({ error: "Error fetching aus open mens doubles finals data" });
    }
});

router.get('/aowomenssinglesfinals', async (req: Request, res: Response) => {
    try {

        const data = await pool.query('SELECT * FROM aus_open_womens_singles ORDER BY year DESC');
        res.json(data.rows);

    } catch (error: unknown) {
        console.error('Database error:', error);
        res.status(500).json({ error: "Error fetching aus open womens singles finals data" });
    }
});

router.get('/aowomensdoublesfinals', async (req: Request, res: Response) => {
    try {

        const data = await pool.query('SELECT * FROM aus_open_womens_doubles ORDER BY year DESC');
        res.json(data.rows);

    } catch (error: unknown) {
        console.error('Database error:', error);
        res.status(500).json({ error: "Error fetching aus open womens doubles finals data" });
    }
});

export default router;

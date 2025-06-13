import { Request, Response } from 'express';
import { getMensSingles, getMensDoubles, getWomensSingles, getWomensDoubles } from '../models/ausOpenFinalsModel.js';

export const getMensSinglesFinals = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await getMensSingles();
        res.json(data);
    } catch (error: unknown) {
        console.error('Database error:', error);
        res.status(500).json({ error: "Error fetching aus open mens singles finals data" });
    }
};

export const getMensDoublesFinals = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await getMensDoubles();
        res.json(data);
    } catch (error: unknown) {
        console.error('Database error:', error);
        res.status(500).json({ error: "Error fetching aus open mens doubles finals data" });
    }
};

export const getWomensSinglesFinals = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await getWomensSingles();
        res.json(data);
    } catch (error: unknown) {
        console.error('Database error:', error);
        res.status(500).json({ error: "Error fetching aus open womens singles finals data" });
    }
};

export const getWomensDoublesFinals = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await getWomensDoubles();
        res.json(data);
    } catch (error: unknown) {
        console.error('Database error:', error);
        res.status(500).json({ error: "Error fetching aus open womens doubles finals data" });
    }
};

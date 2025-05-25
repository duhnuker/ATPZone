import express, { Request, Response, Router } from 'express'
import csv from 'csv-parser';
import fs from 'fs';

const router: Router = express.Router();

router.get('/aomenssinglesfinals', (req: Request, res: Response) => {
    try {
        const ausOpenMensFinalsData: any = [];

        fs.createReadStream('../DataScraping/australian_open_men_singles_champions.csv')
            .pipe(csv())
            .on('data', (data) => ausOpenMensFinalsData.push(data))
            .on('end', () => {
                res.json(ausOpenMensFinalsData);
            })
            .on('error', (error) => {
                console.error('Error reading CSV:', error);
                res.status(500).json({ error: "Error reading CSV file" });
            });

    } catch (error: unknown) {
        res.status(500).json({ error: "Error fetching aus open mens finals data" });
    }
});

router.get('/aowomenssinglesfinals', (req: Request, res: Response) => {
    try {
        const ausOpenWomensFinalsData: any = [];

        fs.createReadStream('../DataScraping/australian_open_women_singles_champions.csv')
            .pipe(csv())
            .on('data', (data) => ausOpenWomensFinalsData.push(data))
            .on('end', () => {
                res.json(ausOpenWomensFinalsData);
            })
            .on('error', (error) => {
                console.error('Error reading CSV:', error);
                res.status(500).json({ error: "Error reading CSV file" });
            });

    } catch (error: unknown) {
        res.status(500).json({ error: "Error fetching aus open womens finals data" });
    }
});

export default router;

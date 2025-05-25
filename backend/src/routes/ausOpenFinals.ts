import express, { Request, Response, Router } from 'express'
import csv from 'csv-parser';
import fs from 'fs';

const router: Router = express.Router();

router.get('/mensfinals', (req: Request, res: Response) => {
    try {

        const ausOpenMensFinalsData: any = [];

        fs.createReadStream('../DataScraping/australian_open_men_singles_champions.csv')
            .pipe(csv())
            .on('data', (data) => ausOpenMensFinalsData.push(data))
            .on('end', () => {
                console.log(ausOpenMensFinalsData);
            });

    } catch (error: unknown) {
        res.status(500).json({ error: "Error fetching aus open mens finals data" });
    }
});

export default router;

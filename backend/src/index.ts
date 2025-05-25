import express, { Request, Response, Router } from 'express';
import pkg from 'pg'
const { Pool } = pkg;
import cors from 'cors';
import 'dotenv/config';
import ausOpenFinals from '../src/routes/ausOpenFinals.js'

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", async(req: Request, res: Response) => {
    res.send("Hello World");
});

app.use('/api/ausOpenFinals', ausOpenFinals);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

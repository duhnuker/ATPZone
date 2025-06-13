import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import routes from './routes/index.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", async (req: Request, res: Response) => {
    res.send("Hello World");
});

app.use('/api', routes);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

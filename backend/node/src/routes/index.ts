import express, { Router } from 'express';
import ausOpenFinals from './ausOpenFinals.js';
import predictWinner from './predictWinner.js';

const router: Router = express.Router();

router.use('/ausopenfinals', ausOpenFinals);
router.use('/predict', predictWinner);

export default router;

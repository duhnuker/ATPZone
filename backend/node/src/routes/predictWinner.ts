import express, { Router } from 'express';
import { 
    predictMensWinnerController, 
} from '../controllers/predictWinnerController.js';

const router: Router = express.Router();

router.post('/predictmenswinner', predictMensWinnerController);

export default router;

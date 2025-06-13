import express, { Router } from 'express';
import { 
    getMensSinglesFinals, 
    getMensDoublesFinals, 
    getWomensSinglesFinals, 
    getWomensDoublesFinals 
} from '../controllers/ausOpenFinalsController.js';

const router: Router = express.Router();

router.get('/aomenssinglesfinals', getMensSinglesFinals);
router.get('/aomensdoublesfinals', getMensDoublesFinals);
router.get('/aowomenssinglesfinals', getWomensSinglesFinals);
router.get('/aowomensdoublesfinals', getWomensDoublesFinals);

export default router;

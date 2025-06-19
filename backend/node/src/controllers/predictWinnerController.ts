import { Request, Response } from 'express';
import axios from 'axios';
import { predictMensWinner, validatePlayers } from '../models/predictWinnerModel.js';

export interface PlayerInput {
    player1: string;
    player2: string;
    surface: string;
    round: string;
    bestOf: string;
    player1Odds: string;
    player2Odds: string;
    player1Stats: {
        rank: string;
        points: string;
        date: string;
    };
    player2Stats: {
        rank: string;
        points: string;
        date: string;
    };
}

export const predictMensWinnerController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { 
            player1, 
            player2, 
            surface, 
            round, 
            bestOf, 
            player1Odds, 
            player2Odds,
            player1Stats,
            player2Stats
        }: PlayerInput = req.body;

        const validation = validatePlayers(player1, player2);
        if (!validation.isValid) {
            res.status(400).json({ error: validation.error });
            return;
        }

        console.log(`Processing mens prediction request for ${player1} vs ${player2}`);
        console.log('Player 1 stats:', player1Stats);
        console.log('Player 2 stats:', player2Stats);

        const prediction = await predictMensWinner(
            player1, 
            player2, 
            surface, 
            round, 
            bestOf, 
            player1Odds, 
            player2Odds,
            player1Stats,
            player2Stats
        );

        console.log('Sending prediction response to frontend:', prediction);
        res.json(prediction);

    } catch (error) {
        console.error("Error in predictmenswinner route:", error);

        if (axios.isAxiosError(error)) {
            const status = error.response?.status || 500;
            const message = error.response?.data?.detail || error.message;

            res.status(status).json({
                error: "Failed to get prediction from ML service",
                details: message,
                fastapierror: true
            });
            return;
        }

        if (error instanceof Error) {
            res.status(500).json({
                error: error.message,
            });
            return;
        }

        res.status(500).json({
            error: "Internal server error",
        });
    }
};

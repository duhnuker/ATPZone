import axios from 'axios';

export interface PredictionResult {
    winner: string;
    confidence: number;
}

export interface PlayerStats {
    rank: string;
    points: string;
    date: string;
}

const FASTAPI_BASE_URL = process.env.FASTAPI_URL || "http://localhost:8000";

export const predictMensWinner = async (
    player1: string, 
    player2: string, 
    surface: string, 
    round: string, 
    best_of: string, 
    player1Odds: string, 
    player2Odds: string,
    player1Stats: PlayerStats,
    player2Stats: PlayerStats
): Promise<PredictionResult> => {
    try {
        console.log(`Calling FastAPI for mens prediction: ${player1} vs ${player2}`);

        const requestData = {
            player1,
            player2,
            surface,
            round,
            best_of,
            player1Odds,
            player2Odds,
            ...(player1Stats && { player1Stats }),
            ...(player2Stats && { player2Stats })
        };

        const response = await axios.post(`${FASTAPI_BASE_URL}/predictmenswinner`, requestData, {
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('FastAPI response received:', response.data);
        return response.data;

    } catch (error) {
        console.error('Error calling FastAPI:', error);
        if (axios.isAxiosError(error)) {
            if (error.code === 'ECONNREFUSED') {
                throw new Error('FastAPI service is not available. Please ensure it is running.');
            }
            throw error;
        }
        throw new Error('Unknown error occurred while calling prediction service');
    }
};

export const validatePlayers = (player1: string, player2: string): { isValid: boolean; error?: string } => {
    if (!player1 || !player2) {
        return { isValid: false, error: "Both players are required" };
    }

    if (player1 === player2) {
        return { isValid: false, error: "Players must be different" };
    }

    return { isValid: true };
};

import { pool } from '../config/database.js';

export interface AusOpenSinglesResult {
    id: number;
    year: number;
    champion_country: string;
    champion_name: string;
    runners_up_country: string;
    runners_up: string;
    score: string;
}

export interface AusOpenDoublesResult {
    id: number;
    year: number;
    champions_countries: string;
    champions_names: string;
    runners_up_countries: string;
    runners_up_names: string;
    score: string;
}

export const getMensSingles = async (): Promise<AusOpenSinglesResult[]> => {
    const result = await pool.query('SELECT * FROM aus_open_mens_singles ORDER BY year DESC');
    return result.rows;
};

export const getMensDoubles = async (): Promise<AusOpenDoublesResult[]> => {
    const result = await pool.query('SELECT * FROM aus_open_mens_doubles ORDER BY year DESC');
    return result.rows;
};

export const getWomensSingles = async (): Promise<AusOpenSinglesResult[]> => {
    const result = await pool.query('SELECT * FROM aus_open_womens_singles ORDER BY year DESC');
    return result.rows;
};

export const getWomensDoubles = async (): Promise<AusOpenDoublesResult[]> => {
    const result = await pool.query('SELECT * FROM aus_open_womens_doubles ORDER BY year DESC');
    return result.rows;
};

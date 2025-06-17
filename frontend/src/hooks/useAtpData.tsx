import { useState, useEffect } from 'react';
import axios from 'axios';

export interface AtpMatch {
  Surface: string;
  Round: string;
  'Best of': string;
}

export interface AtpFilters {
  surfaces: string[];
  rounds: string[];
  bestOfs: string[];
}

export const useAtpData = () => {
  const [filters, setFilters] = useState<AtpFilters>({
    surfaces: [],
    rounds: [],
    bestOfs: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAtpData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('../../atp.csv');
        
        // Parse CSV data
        const csvData = response.data;
        const lines = csvData.split('\n');
        const headers = lines[0].split(',');
        
        const surfaceSet = new Set<string>();
        const roundSet = new Set<string>();
        const bestOfSet = new Set<string>();

        // Skip header row and process data
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line) {
            const values = line.split(',');
            if (values.length >= headers.length) {
              const surface = values[4]?.trim();
              const round = values[5]?.trim();
              const bestOf = values[6]?.trim();

              if (surface) surfaceSet.add(surface);
              if (round) roundSet.add(round);
              if (bestOf) bestOfSet.add(bestOf);
            }
          }
        }

        setFilters({
          surfaces: Array.from(surfaceSet).sort(),
          rounds: Array.from(roundSet).sort(),
          bestOfs: Array.from(bestOfSet).sort()
        });
      } catch (err) {
        console.error('Error fetching ATP data:', err);
        setError('Failed to load ATP data');
      } finally {
        setLoading(false);
      }
    };

    fetchAtpData();
  }, []);

  return { filters, loading, error };
};

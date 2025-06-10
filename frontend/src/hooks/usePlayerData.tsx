import { useState, useEffect } from 'react';

// CSV parsing handling quoted fields
const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
};

export const usePlayerData = () => {
  const [players, setPlayers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPlayerData = async () => {
      try {
        const response = await fetch('../../public/atp.csv');
        if (!response.ok) {
          throw new Error('Failed to fetch player data');
        }
        
        const csvText = await response.text();
        const lines = csvText.split('\n');
        
        const playerSet = new Set<string>();
        
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line) {
            try {
              const columns = parseCSVLine(line);
              
              if (columns.length >= 9) {
                const player1 = columns[7]?.trim();
                const player2 = columns[8]?.trim();
                
                // Add players to set if they're valid
                if (player1 && player1 !== '-1' && player1 !== '' && player1 !== 'Player_1') {
                  playerSet.add(player1);
                }
                if (player2 && player2 !== '-1' && player2 !== '' && player2 !== 'Player_2') {
                  playerSet.add(player2);
                }
              }
            } catch (parseError) {
              console.warn(`Error parsing line ${i + 1}:`, line);
            }
          }
        }
        
        // Convert set to sorted array
        const uniquePlayers = Array.from(playerSet).sort();
        console.log(`Loaded ${uniquePlayers.length} unique players`);
        setPlayers(uniquePlayers);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error loading player data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPlayerData();
  }, []);

  return { players, loading, error };
};

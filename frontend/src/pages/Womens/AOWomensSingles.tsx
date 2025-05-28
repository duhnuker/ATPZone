import { Heading, Table } from '@radix-ui/themes'
import { useEffect, useState } from 'react'
import axios from 'axios'

interface AOWomensFinalsData {
  id: number;
  year: number;
  champion_country: string;
  champion_name: string;
  runner_up_country: string;
  runner_up: string;
  score: string;
}

const AOWomensSingles = () => {
  const [finalsData, setFinalsData] = useState<AOWomensFinalsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFinalsData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/ausopenfinals/aowomenssinglesfinals');
        
        if (Array.isArray(response.data)) {
          setFinalsData(response.data);
        } else {
          setError('Invalid data format received from server');
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.error || err.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFinalsData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Heading>Australian Open Women's Singles Winners</Heading>
      
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Year</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Champion</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Country</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Runner-up</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Country</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Score</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {finalsData.map((final) => (
            <Table.Row key={final.id}>
              <Table.Cell>{final.year}</Table.Cell>
              <Table.Cell>{final.champion_name}</Table.Cell>
              <Table.Cell>{final.champion_country}</Table.Cell>
              <Table.Cell>{final.runner_up}</Table.Cell>
              <Table.Cell>{final.runner_up_country}</Table.Cell>
              <Table.Cell>{final.score}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  )
}

export default AOWomensSingles

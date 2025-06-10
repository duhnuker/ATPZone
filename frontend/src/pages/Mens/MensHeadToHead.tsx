import { Box, Container, Flex, Heading, Text, Button } from '@radix-ui/themes';
import { useState } from 'react';
import axios from 'axios';
import PlayerAutocomplete from '../../components/PlayerAutocomplete';
import { usePlayerData } from '../../hooks/usePlayerData';

const MensHeadToHead = () => {
    const [player1, setPlayer1] = useState('');
    const [player2, setPlayer2] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const { players, loading, error } = usePlayerData();

    const handleSubmit = async () => {
        if (!player1 || !player2) {
            setSubmitMessage('Please select both players');
            return;
        }

        if (player1 === player2) {
            setSubmitMessage('Please select different players');
            return;
        }

        setIsSubmitting(true);
        setSubmitMessage('');

        try {
            const response = await axios.post('/api/getmensinput', {
                player1,
                player2
            });

            setSubmitMessage('Players submitted successfully!');
            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error submitting players:', error);

            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.error || error.message;
                setSubmitMessage(`Error: ${errorMessage}`);
            } else {
                setSubmitMessage('Failed to submit players. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Box>
                <Container>
                    <Box className='text-center'>
                        <Heading>MensHeadToHead</Heading>
                        <Text>Loading player data...</Text>
                    </Box>
                </Container>
            </Box>
        );
    }

    if (error) {
        return (
            <Box>
                <Container>
                    <Box className='text-center'>
                        <Heading>MensHeadToHead</Heading>
                        <Text color="red">Error loading player data: {error}</Text>
                    </Box>
                </Container>
            </Box>
        );
    }

    return (
        <Box>
            <Container>
                <Box className='text-center'>
                    <Heading>MensHeadToHead</Heading>
                </Box>
                <Flex direction="column" align="center" gap="4" style={{ marginTop: '20px' }}>
                    <Flex justify="center" gap="4">
                        <PlayerAutocomplete
                            placeholder="Search player 1:"
                            onPlayerSelect={setPlayer1}
                            players={players}
                        />
                        <PlayerAutocomplete
                            placeholder="Search player 2:"
                            onPlayerSelect={setPlayer2}
                            players={players}
                        />
                    </Flex>

                    {(player1 || player2) && (
                        <Box className='text-center'>
                            <Text size="2">
                                {player1 && `Player 1: ${player1}`}
                                {player1 && player2 && ' | '}
                                {player2 && `Player 2: ${player2}`}
                            </Text>
                        </Box>
                    )}

                    <Button
                        onClick={handleSubmit}
                        disabled={!player1 || !player2 || isSubmitting}
                        size="3"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Players'}
                    </Button>

                    {submitMessage && (
                        <Text
                            color={submitMessage.includes('Error') || submitMessage.includes('Failed') ? 'red' : 'green'}
                            size="2"
                        >
                            {submitMessage}
                        </Text>
                    )}
                </Flex>
            </Container>
        </Box>
    );
};

export default MensHeadToHead;

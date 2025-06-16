import { Box, Container, Flex, Heading, Text, Button, Card } from '@radix-ui/themes';
import { useState } from 'react';
import axios from 'axios';
import PlayerAutocomplete from '../../components/PlayerAutocomplete';
import { usePlayerData } from '../../hooks/usePlayerData';

const MensHeadToHead = () => {
    const [player1, setPlayer1] = useState('');
    const [player2, setPlayer2] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const { players, loading, error, getPlayerStats } = usePlayerData();

    // Get player stats
    const player1Stats = player1 ? getPlayerStats(player1) : null;
    const player2Stats = player2 ? getPlayerStats(player2) : null;

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
                    <Flex justify="center" gap="4" style={{ width: '100%', maxWidth: '800px' }}>
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

                    {/* Player Stats Display */}
                    {(player1 || player2) && (
                        <Flex gap="4" style={{ width: '100%', maxWidth: '800px' }}>
                            {/* Player 1 Stats */}
                            <Box style={{ flex: 1 }}>
                                {player1 && (
                                    <Card style={{ padding: '16px', textAlign: 'center' }}>
                                        <Heading size="3" style={{ marginBottom: '8px' }}>
                                            {player1}
                                        </Heading>
                                        {player1Stats ? (
                                            <Flex direction="column" gap="2">
                                                <Text size="2">
                                                    <strong>Rank:</strong> {player1Stats.rank}
                                                </Text>
                                                <Text size="2">
                                                    <strong>Points:</strong> {player1Stats.points}
                                                </Text>
                                                <Text size="2" color="gray">
                                                    <strong>As of:</strong> {player1Stats.date}
                                                </Text>
                                            </Flex>
                                        ) : (
                                            <Text size="2" color="gray">
                                                No stats available
                                            </Text>
                                        )}
                                    </Card>
                                )}
                            </Box>

                            {/* VS Divider */}
                            {player1 && player2 && (
                                <Flex align="center" justify="center" style={{ minWidth: '40px' }}>
                                    <Text size="4" weight="bold" color="gray">
                                        VS
                                    </Text>
                                </Flex>
                            )}

                            {/* Player 2 Stats */}
                            <Box style={{ flex: 1 }}>
                                {player2 && (
                                    <Card style={{ padding: '16px', textAlign: 'center' }}>
                                        <Heading size="3" style={{ marginBottom: '8px' }}>
                                            {player2}
                                        </Heading>
                                        {player2Stats ? (
                                            <Flex direction="column" gap="2">
                                                <Text size="2">
                                                    <strong>Rank:</strong> {player2Stats.rank}
                                                </Text>
                                                <Text size="2">
                                                    <strong>Points:</strong> {player2Stats.points}
                                                </Text>
                                                <Text size="2" color="gray">
                                                    <strong>As of:</strong> {player2Stats.date}
                                                </Text>
                                            </Flex>
                                        ) : (
                                            <Text size="2" color="gray">
                                                No stats available
                                            </Text>
                                        )}
                                    </Card>
                                )}
                            </Box>
                        </Flex>
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

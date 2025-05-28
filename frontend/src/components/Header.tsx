import { Container, Heading, Flex, Box} from '@radix-ui/themes';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <Box className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
            <Container>
                <Flex justify="between" align="center" className="py-3 px-4 sm:py-4 sm:px-0">
                    <Heading size={{ initial: "5", sm: "6" }} as="h1" className="font-bold">
                        <Link to="/" className="text-crimson-11 hover:text-crimson-12 transition-colors no-underline">
                            AOFever
                        </Link>
                    </Heading>
                </Flex>
            </Container>
        </Box>
    )
}

export default Header
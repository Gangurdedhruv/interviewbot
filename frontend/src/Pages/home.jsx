import { Box, Button, VStack, Heading } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <Box>
      <Heading>Welcome to Interview Bot</Heading>
      <VStack spacing={4}>
        <Link to="/registration">
          <Button>Go to Registration</Button>
        </Link>
        <Link to="/login">
          <Button>Go to Login</Button>
        </Link>
      </VStack>
    </Box>
  );
};

export default Home;

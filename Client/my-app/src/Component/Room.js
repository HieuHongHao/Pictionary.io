import { Box, Heading, Text, Button, Center } from '@chakra-ui/react';
import { useOutletContext } from 'react-router';
export default function Room({room}) {
  const[setIsLogedIn,setRoute] = useOutletContext();
  
  return (
    <Box p={5} shadow="md" borderWidth="1px">
      <Heading fontSize="xl">{room.name}</Heading>
      <Text mt={4}>{`owned by: ${localStorage.getItem('auth')}`}</Text>
      <Text mt={4}>{'participants:'}</Text>
      <Text mt={4}>{'Hieu,your friend,is in here is in here'}</Text>
      <Center p={5}>
        <Button
          colorScheme={'twitter'}
          size="md"
          variant={'solid'}
          onClick={() => setRoute({link: `/room/${room.name}`,data:room})}
        >
          Join Room
        </Button>
      </Center>
    </Box>
  );
}

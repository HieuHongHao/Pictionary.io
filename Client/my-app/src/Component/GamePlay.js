import {
  Box,
  Button,
  Flex,
  Spacer,
  Heading,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router';
import { io } from 'socket.io-client';
import DrawBoard from './DrawBoard';
import ScoreBoard from './ScoreBoard';



let socket = io('http://127.0.0.1:8000');
export default function GamePlay() {
  const [setIsLogedIn, setRoute, route] = useOutletContext();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  
  const sendMessage = (e) => {
    e.preventDefault();
    console.log(message);
    if (message) {
      socket.emit('incomming-message', {
        message: {
          from: localStorage.getItem('auth'),
          content: message,
        },
      });
    }
  };
  useEffect(() => {
    const receiveMessage = (msg) => {
        console.log(msg);
        setMessages(prev => [...prev,msg]);
      };
      socket.emit('join-room', {
        username: localStorage.getItem('auth'),
        room: route?.data.name,
      });
      socket.on('message-from-server',receiveMessage);
      return () => socket.off('message-from-server',receiveMessage);
    }
  , []);

  return (
    <>
      <Heading>{route?.data.name}</Heading>
      <Flex alignItems="center" marginRight={30}>
        <ScoreBoard/>
        <Spacer/>
        <DrawBoard socket = {socket}/>
        <Spacer />
        <Box w={500} marginLeft={30}>
          <Stack direction={'column'}>
            {messages?.map((msg, id) => (
              <Text fontSize={'md'} key={id}>
                {`From ${msg.from}: ${msg.content}`}
              </Text>
            ))}
            <Textarea
              placeholder="Enter your comment"
              onChange={e => setMessage(e.target.value)}
            />
            <Button variant={'solid'} colorScheme="teal" onClick={(e) => sendMessage(e)}>
              Send me daddy
            </Button>
          </Stack>
        </Box>
      </Flex>
    </>
  );
}

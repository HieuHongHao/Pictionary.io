import {
  Box,
  Button,
  Flex,
  Spacer,
  Heading,
  Stack,
  Text,
  Textarea,
  Input,
  Tag,
  TagLabel,
  TagLeftIcon,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router';
import { BsFillHandIndexThumbFill } from 'react-icons/bs';
import DrawBoard from './DrawBoard';
import ScoreBoard from './ScoreBoard';

export default function GamePlay() {
  const [setRoute, route, socket] = useOutletContext();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [profile, setProfile] = useState(null);
  const [playerShowUp, setPlayerShowUp] = useState([]);
  const [players, setPlayers] = useState([]);

  const sendMessage = e => {
    e.preventDefault();
    if (message) {
      socket.emit('incomming-message', {
        message: {
          from: localStorage.getItem('auth'),
          content: message,
        },
        room: profile?.room,
      });
    }
  };
  const assign = e => {
    e.preventDefault();
    socket.emit('assign', { room: route?.data.name });
  };
  useEffect(() => {
    const receiveMessage = msg => {
      console.log(msg);
      setMessages(prev => [...prev, msg]);
    };
    const receiveUserProfile = profile => {
      if (profile) {
        console.log(profile);
        setProfile(profile);
      }
    };
    socket.emit('join-room', {
      username: localStorage.getItem('auth'),
      room: route?.data.name,
      authority:
        route?.data.owner === localStorage.getItem('auth') ? 'owner' : 'player',
    });
    socket.on('message-from-server', receiveMessage);
    socket.on('new-player-joined', response => {
      setPlayerShowUp(prev => response.messages);
    });
    socket.on('assign-role', ({ players }) => {
      for (const player of players) {
        if (player.username === localStorage.getItem('auth')) {
          setProfile(player);
        }
      }
      setPlayers(players);
    });
    socket.on('player-registered', receiveUserProfile);
    return () => socket.removeAllListeners();
  }, []);

  return (
    <>
      <Heading>{route?.data.name}</Heading>
      <Flex alignItems="center" marginRight={30}>
        <Flex direction={'column'}>
          <ScoreBoard players={players} />
          {profile?.authority === 'owner' ? (
            <Box marginLeft={'120'}>
              <Button size={'md'} margin="auto" onClick={assign}>
                Assign Role
              </Button>
            </Box>
          ) : (
            <></>
          )}
        </Flex>
        <Spacer />
        <Flex direction={'column'}>
          <DrawBoard socket={socket} profile={profile} />
          <Box marginLeft={'120'} marginTop={'50'}>
            {profile?.role === 'Guesser' ? (
              <>
                <Input
                  placeholder="Guess the word"
                  borderRadius="10px"
                  borderWidth="3px"
                  borderColor={'twitter.500'}
                />
                <Button variant={'solid'} marginTop={'5'}>
                  Guess
                </Button>
              </>
            ) : (
              <Tag
                size={'lg'}
                colorScheme={'twitter'}
                variant={'subtle'}
                marginLeft={'170'}
                borderRadius={'full'}
              >
                <TagLeftIcon boxSize="20px" as={BsFillHandIndexThumbFill} />
                <TagLabel> The word </TagLabel>
              </Tag>
            )}
          </Box>
        </Flex>
        <Spacer />
        <Box w={500} marginLeft={30}>
          <Stack direction={'column'}>
            {playerShowUp?.map((msg, id) => (
              <Text fontSize={'md'} fontWeight="semibold" key={id}>
                {`${msg} has joined the room`}
              </Text>
            ))}
            {messages?.map((msg, id) => (
              <Text fontSize={'md'} key={id}>
                {`From ${msg.from}: ${msg.content}`}
              </Text>
            ))}
            <Textarea
              placeholder="Enter your comment"
              onChange={e => setMessage(e.target.value)}
            />
            <Button
              variant={'solid'}
              colorScheme="teal"
              onClick={e => sendMessage(e)}
            >
              Send me daddy
            </Button>
          </Stack>
        </Box>
      </Flex>
    </>
  );
}

import {
  Spacer,
  Flex,
  Button,
  ButtonGroup,
  Heading,
  VStack,
  Highlight,
  Center,
  Box,
  Stat,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react';
import { useNavigate, useOutletContext } from 'react-router';
import { useState, useEffect, useRef } from 'react';
import Room from './Room';
import Api from '../Api';
import PopUp from './Popup';

export default function UserPage() {
  const [setRoute, route, socket] = useOutletContext();
  const [rooms, setRooms] = useState([]);
  const [roomAdd, setRoomAdd] = useState('');
  const [roomCreate, setRoomCreate] = useState('');
  const [second, setSecond] = useState(0);
  const [timerMode, setTimerMode] = useState(false);
  const timer = useRef(null);
  const navigate = useNavigate();
  async function createRoom(name) {
    const response = await Api.post(
      '/room/create',
      {
        name: name,
      },
      {
        headers: {
          Authorization: localStorage.getItem('auth'),
        },
      }
    );
    if (response.data.rooms) {
      setRooms(response.data.rooms);
    }
  }

  async function addRoom(name) {
    const response = await Api.post(
      '/room/join',
      {
        name: name,
      },
      {
        headers: {
          Authorization: localStorage.getItem('auth'),
        },
      }
    );
    if (response.data.room) {
      setRooms(prev => [...prev, response.data.room]);
    }
  }
  async function queueMatch() {
    const response = await Api.post(
      '/match',
      {
        score: 0,
      },
      {
        headers: {
          Authorization: localStorage.getItem('auth'),
        },
      }
    );
    console.log(response);
  }

  useEffect(() => {
    async function fetchRooms() {
      const response = await Api.get('/room', {
        headers: {
          Authorization: localStorage.getItem('auth'),
        },
      });
      if (response.data.rooms) {
        setRooms(response.data.rooms);
      }
    }
    fetchRooms();
  }, []);
  useEffect(() => {
    const receiveMatchStatus = response => {
      if (response.status === 'Ticket found') {
        console.log(response);
        setTimerMode(false);
        setSecond(0);
        setRoute({ link: `/room/${response.ticket}`, data:{
          name:response.ticket,
          owner: response.owner
        }});
        navigate(`/room/${response.ticket}`);
      }
    };
    if (timerMode && timer.current === null) {
      socket.on('match-status', receiveMatchStatus);
      timer.current = setInterval(() => {
        socket.emit('check-matches', {
          username: localStorage.getItem('auth'),
        });
        setSecond(prevSecond => prevSecond + 1);
      }, 1000);
    }
    return () => {
      clearInterval(timer.current);
      console.log(timer.current);
      timer.current = null;
      socket.removeListener('match-status', receiveMatchStatus);
    };
  }, [timerMode]);

  return (
    <Box
      backgroundImage={'http://localhost:3000/vector.webp'}
      backgroundSize={'auto'}
    >
      <Flex minWidth="max-content" alignItems="center" gap="2">
        <ButtonGroup marginLeft={30}>
          <PopUp
            title={'Create Room'}
            setState={setRoomCreate}
            action={() => createRoom(roomCreate)}
            helperText={'Enter the room name to create new room'}
          />
          <PopUp
            title={'Add Room'}
            setState={setRoomAdd}
            action={() => addRoom(roomAdd)}
            helperText={'Enter the room name to add the room'}
          />
          <Button colorScheme="teal" size="lg" variant={'solid'}>
            Add Friend
          </Button>
          <Button colorScheme="teal" size="lg" variant={'solid'}>
            View Score
          </Button>
          <Button
            colorScheme="teal"
            size="lg"
            variant={'solid'}
            onClick={() => {
              setTimerMode(true);
              queueMatch();
            }}
          >
            Find Match
          </Button>
          {timerMode && (
            <Stat>
              <StatLabel>Time until game starts</StatLabel>
              <StatLabel>
                <Button
                  size="sm"
                  colorScheme={'red'}
                  variant={'outline'}
                  onClick={() => {
                    setTimerMode(false);
                    setSecond(0);
                  }}
                >
                  Cancel Match
                </Button>
              </StatLabel>
              <StatNumber>
                <Highlight
                  query={`${second}`}
                  styles={{ px: '3', rounded: 'full', bg: 'twitter.100' }}
                >{`${second}`}</Highlight>
              </StatNumber>
            </Stat>
          )}
        </ButtonGroup>
        <Spacer />
        <ButtonGroup gap="2">
          <Button
            colorScheme={'teal'}
            size="lg"
            variant={'solid'}
            marginRight={30}
          >
            View Online Friends
          </Button>
          <Button
            colorScheme={'teal'}
            size="lg"
            variant={'solid'}
            marginRight={30}
            onClick={() => {
              localStorage.removeItem('auth');
              setRoute({
                link: '/login',
                data: {},
              });
              navigate('/login');
            }}
          >
            Sign out
          </Button>
        </ButtonGroup>
      </Flex>
      <Center>
        <Heading lineHeight="tall" mb={10} size="4xl">
          <Highlight
            query={['Welcome to Pictionary.io']}
            styles={{ px: '2', py: '1', rounded: 'full', bg: 'teal.100' }}
            key={'heading-1'}
          >
            Welcome to Pictionary.io
          </Highlight>
        </Heading>
      </Center>
      <Center>
        <Heading lineHeight="tall" mb={10} size="4xl">
          <Highlight
            query={['online, realtime, multiplayer']}
            styles={{ px: '2', py: '1', rounded: 'full', bg: 'teal.100' }}
            key={'heading-2'}
          >
            online, realtime, multiplayer
          </Highlight>
        </Heading>
      </Center>
      <VStack spacing={24}>
        {rooms?.map(room => (
          <Room room={room} key={room.id} />
        ))}
      </VStack>
    </Box>
  );
}

import {
  SimpleGrid,
  Spacer,
  Flex,
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Portal,
} from '@chakra-ui/react';
import { useOutletContext } from 'react-router';
import { useState, useEffect } from 'react';
import Room from './Room';
import Api from '../Api';

export default function UserPage() {
  const [setIsLogedIn] = useOutletContext();
  const [rooms, setRooms] = useState([]);
  const [roomAdd, setRoomAdd] = useState('');
  
  async function createRoom() {
    const response = await Api.post(
      '/room/create',
      {
        name: 'Shreak',
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

  return (
    <>
      <Flex minWidth="max-content" alignItems="center" gap="2">
        <ButtonGroup marginLeft={30}>
          <Button
            colorScheme="teal"
            size="md"
            variant="solid"
            onClick={() => createRoom()}
          >
            Create Room
        </Button>
          <Popover>
            <PopoverTrigger>
              <Button colorScheme="teal" size="md" variant="solid">
                Add Room
              </Button>
            </PopoverTrigger>
            <Portal>
              <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody>
                  <FormControl>
                    <FormLabel htmlFor="email">Enter room's name</FormLabel>
                    <Input
                      id="room"
                      type="room"
                      onChange={e => setRoomAdd(e.target.value)}
                    />
                    <FormHelperText>
                      Enter the room name to add the room
                    </FormHelperText>
                  </FormControl>
                  <Button
                    colorScheme="teal"
                    size="md"
                    variant="solid"
                    onClick={() => addRoom(roomAdd)}
                  >
                    add
                  </Button>
                </PopoverBody>
              </PopoverContent>
            </Portal>
          </Popover>
          <Button colorScheme="teal" size="md" variant={'solid'}>
            Add Friend
          </Button>
          <Button colorScheme="teal" size="md" variant={'solid'}>
            View Score
          </Button>
        </ButtonGroup>
        <Spacer />
        <ButtonGroup gap="2">
          <Button
            colorScheme={'teal'}
            size="md"
            variant={'solid'}
            marginRight={30}
          >
            View Online Friends
          </Button>
          <Button
            colorScheme={'teal'}
            size="md"
            variant={'solid'}
            marginRight={30}
            onClick={() => {
              localStorage.removeItem('auth');
              setIsLogedIn(false);
            }}
          >
            Sign out
          </Button>
        </ButtonGroup>
      </Flex>
      <SimpleGrid
        columns={4}
        spacing={10}
        marginTop={50}
        marginLeft={50}
        marginRight={50}
      >
        {rooms?.map((room, id) => (
          <Room room={room} key={id} />
        ))}
      </SimpleGrid>
    </>
  );
}

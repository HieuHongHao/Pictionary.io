import {
  Box,
  Heading,
  Button,
  Center,
  Tag,
  Avatar,
  Stack,
  TagLabel,
} from '@chakra-ui/react';
import { useOutletContext, useNavigate } from 'react-router';

export default function Room({ room }) {
  const [setRoute] = useOutletContext();
  const navigate = useNavigate();
  return (
    <Box borderWidth={1.5} borderRadius="15" overflow="hidden" width={600}>
      <Box p={4} bgBlendMode={'soft-light'} w="100%" bg={'gray.300'}>
        <Heading fontSize="xl">{room.name}</Heading>
        <Stack direction={'row'}>
          <Avatar size="sm" name="Hieu"></Avatar>
          <Avatar size="sm" name="Shrek"></Avatar>
          <Avatar size="sm" name="Shrek Duc"></Avatar>
          <Avatar size="sm" name="Trung"></Avatar>
        </Stack>
      </Box>
      <Box pl={4} bg={'gray.100'}>
        <Heading fontSize={'lg'}>{`Owner: ${
          room.owner ? room.owner : localStorage.getItem('auth')
        }`}</Heading>
      </Box>
      <Box
        pl={4}
        paddingTop={5}
        fontWeight="semibold"
        as="h4"
        lineHeight="tight"
        noOfLines={1}
        bg={'gray.100'}
      >
        <Tag
          size={'md'}
          colorScheme={'cyan'}
          variant="subtle"
          borderRadius={'full'}
        >
          <TagLabel>
            <Heading as="h5" size="sm">Average Score: 100</Heading>
          </TagLabel>
        </Tag>
        <Tag
          size={'md'}
          colorScheme={'twitter'}
          variant="subtle"
          borderRadius={'full'}
        >
          <TagLabel>
            <Heading as="h5" size="sm">Participants: 4</Heading>
          </TagLabel>
        </Tag>
        <Box display="flex" alignItems="baseline">
        <Tag
          size={'md'}
          colorScheme={'cyan'}
          variant="subtle"
          borderRadius={'full'}
        >
          <TagLabel>
            <Heading as="h5" size="sm">Hieu,Shrek,Duc are in here</Heading>
          </TagLabel>
        </Tag>
          <Center p={5} pl={107}>
            <Button
              colorScheme={'twitter'}
              size="md"
              variant={'solid'}
              onClick={() => {
                setRoute({ link: `/room/${room.name}`, data: room });
                navigate(`/room/${room.name}`);
              }}
            >
              Join Room
            </Button>
          </Center>
        </Box>
      </Box>
    </Box>
  );
}

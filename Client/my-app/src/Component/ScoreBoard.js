import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from '@chakra-ui/react';

export default function ScoreBoard({ players }) {
  return (
    <TableContainer>
      <Table variant={'striped'}>
        <TableCaption>Score Board</TableCaption>
        <Thead>
          <Tr>
            <Th>Player</Th>
            <Th>Score</Th>
            <Th isNumeric>Rank</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {players?.map((player,id) => (
            <Tr key={player ? player.username : id}>
            <Td>{player.username}</Td>
            <Td>{player.score}</Td>
            <Td isNumeric>1</Td>
            <Td>{player.role}</Td>
          </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

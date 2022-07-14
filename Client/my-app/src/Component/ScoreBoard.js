import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from '@chakra-ui/react';

export default function ScoreBoard() {
  return (
    <TableContainer>
      <Table variant={"striped"}>
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
          <Tr>
            <Td>Hieu</Td>
            <Td>100</Td>
            <Td isNumeric>1</Td>
            <Td>Drawing</Td>
          </Tr>
          <Tr>
            <Td>Shrek</Td>
            <Td>87</Td>
            <Td isNumeric>2</Td>
            <Td>Guessing</Td>
          </Tr>
          <Tr>
            <Td>Trung</Td>
            <Td>80</Td>
            <Td isNumeric>3</Td>
            <Td>Guessing</Td>
          </Tr>
          <Tr>
            <Td>Trung</Td>
            <Td>80</Td>
            <Td isNumeric>3</Td>
            <Td>Guessing</Td>
          </Tr>
        </Tbody>
    </Table>
    </TableContainer>
  );
}

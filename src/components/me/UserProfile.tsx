import {
  AbsoluteCenter,
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading, Image,
  Table,
  TableContainer,
  Tbody, Td, Tr
} from "@chakra-ui/react";

interface Props {
  email: string;
  name: string;
  picture: string;
}

export function UserProfile(props: Props) {
  return (
    <Box position='relative' h='600px'>
      <AbsoluteCenter>
        <Card>
          <CardHeader>
            <Heading size='md'>User Profile</Heading>
          </CardHeader>
          <CardBody>
            <TableContainer>
              <Table>
                <Tbody>
                  <Tr>
                    <Td>name</Td>
                    <Td>{props.name}</Td>
                  </Tr>
                  <Tr>
                    <Td>email</Td>
                    <Td>{props.email}</Td>
                  </Tr>
                  <Tr>
                    <Td>picture</Td>
                    <Td><Image src={props.picture} alt={props.name}/></Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          </CardBody>
        </Card>
      </AbsoluteCenter>
    </Box>
  )
}

import {AbsoluteCenter, Box, Card, CardBody, Text} from '@chakra-ui/react';

export default function Home() {
  return (
    <Box position='relative' h='100px'>
      <AbsoluteCenter>
        <Card align='center'>
          <CardBody>
            <Text>ようこそ</Text>
          </CardBody>
        </Card>
      </AbsoluteCenter>
    </Box>
  )
}

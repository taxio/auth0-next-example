'use client';

import {Box, Button, Flex, Stack, useColorModeValue} from "@chakra-ui/react";

import { useUser } from '@auth0/nextjs-auth0/client';

export function NavigationBar() {
  const { user, isLoading } = useUser();

  return (
    <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <Box>Auth0 Example App</Box>

        <Flex alignItems={'center'}>
          <Stack direction={'row'} spacing={7}>
            {!isLoading && (user ?
              <Button as={'a'} fontSize={'sm'} fontWeight={400} variant={'link'} href={'/api/auth/logout'}>Sign Out</Button> :
              <Button as={'a'} fontSize={'sm'} fontWeight={400} variant={'link'} href={'/api/auth/login'}>Sign In</Button>
            )}
          </Stack>
        </Flex>
      </Flex>
    </Box>
  )
}
import { signOut, useSession } from 'next-auth/react'
import NextLink from 'next/link'

import { ReactNode } from 'react'
import {
  Box,
  Flex,
  Avatar,
  Link,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
} from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'

const NavLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <NextLink href={href} passHref>
    <Link
      px={2}
      py={1}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('gray.200', 'gray.700'),
      }}
    >
      {children}
    </Link>
  </NextLink>
)

export default function Navbar() {
  const session = useSession()
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Box>
            <h1>Moon Paste</h1>
          </Box>

          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={7}>
              {session.status === 'unauthenticated' && (
                <NavLink href="/api/auth/signin">Login</NavLink>
              )}

              {session.status === 'authenticated' && (
                <Menu>
                  <MenuButton
                    as={Button}
                    rounded={'full'}
                    variant={'link'}
                    cursor={'pointer'}
                    minW={0}
                  >
                    <Avatar
                      size={'sm'}
                      src={
                        session.data.user?.image ??
                        `https://avatar.oxro.io/avatar.svg?name=${session.data?.user?.name}`
                      }
                    />
                  </MenuButton>
                  <MenuList alignItems="center">
                    <br />
                    <Center>
                      <Avatar
                        size={'2xl'}
                        src={
                          session.data.user?.image ??
                          `https://avatar.oxro.io/avatar.svg?name=${session.data?.user?.name}`
                        }
                      />
                    </Center>
                    <br />
                    <Center>
                      <p>{session.data.user?.name}</p>
                    </Center>
                    <br />
                    <MenuDivider />
                    <MenuItem>Your Servers</MenuItem>
                    <MenuItem>Account Settings</MenuItem>
                    <MenuItem as="button" onClick={() => signOut()}>
                      Logout
                    </MenuItem>
                  </MenuList>
                </Menu>
              )}

              <Button onClick={toggleColorMode}>
                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              </Button>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  )
}

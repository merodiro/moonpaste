import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Avatar, Button, Container } from '@nextui-org/react'

export default function Navbar() {
  const session = useSession()
  return (
    <Container justify="space-between" alignItems="center" display="flex">
      <h1>Moon Paste</h1>

      {session.status === 'authenticated' && (
        <Avatar
          color="gradient"
          bordered
          zoomed
          squared
          src={
            session.data.user?.image ??
            `https://avatar.oxro.io/avatar.svg?name=${session.data?.user?.name}`
          }
        />
      )}

      {session.status === 'unauthenticated' && (
        <Link href="/api/auth/signin" passHref>
          <Button ghost as="a">
            Login
          </Button>
        </Link>
      )}
    </Container>
  )
}

/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from 'react'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { Avatar, Button, Col, Container, Row, Text } from '@nextui-org/react'

// function ProfileDropdown() {
//   const session = useSession()

//   return (
//     <Menu as="div" className="ml-3 relative">
//       <div>
//         <Menu.Button className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
//           <span className="sr-only">Open user menu</span>
//           <img
//             className="h-8 w-8 rounded-full"
//             src={
//               session.data?.user?.image ??
//               `https://avatar.oxro.io/avatar.svg?name=${session.data?.user?.name}`
//             }
//             alt=""
//           />
//         </Menu.Button>
//       </div>
//       <Transition
//         as={Fragment}
//         enter="transition ease-out duration-100"
//         enterFrom="transform opacity-0 scale-95"
//         enterTo="transform opacity-100 scale-100"
//         leave="transition ease-in duration-75"
//         leaveFrom="transform opacity-100 scale-100"
//         leaveTo="transform opacity-0 scale-95"
//       >
//         <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
//           <Menu.Item>
//             {({ active }) => (
//               <a
//                 href="#"
//                 className={classNames(
//                   active ? 'bg-gray-100' : '',
//                   'block px-4 py-2 text-sm text-gray-700'
//                 )}
//               >
//                 Your Profile
//               </a>
//             )}
//           </Menu.Item>
//           <Menu.Item>
//             {({ active }) => (
//               <button
//                 className={classNames(
//                   active ? 'bg-gray-100' : '',
//                   'block px-4 py-2 text-sm text-gray-700 w-full text-left'
//                 )}
//                 onClick={() => signOut()}
//               >
//                 Sign out
//               </button>
//             )}
//           </Menu.Item>
//         </Menu.Items>
//       </Transition>
//     </Menu>
//   )
// }

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

import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { ChakraProvider, cookieStorageManagerSSR, extendTheme, ThemeConfig } from '@chakra-ui/react'
import { trpc } from '@/utils/trpc'

const config: ThemeConfig = {
  initialColorMode: 'system',
  useSystemColorMode: true,
}

const theme = extendTheme({ config })

function MyApp({ Component, pageProps }: AppProps) {
  const manager = cookieStorageManagerSSR(pageProps.cookie)

  console.log('pageProps', pageProps.cookie)

  return (
    <SessionProvider>
      <ChakraProvider theme={theme} colorModeManager={manager}>
        <Component {...pageProps} />
      </ChakraProvider>
    </SessionProvider>
  )
}

export default trpc.withTRPC(MyApp)

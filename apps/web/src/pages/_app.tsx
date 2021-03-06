import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { withTRPC } from '@trpc/next'
import { AppRouter } from '@/server/routers/_app'
import { loggerLink } from '@trpc/client/links/loggerLink'
import { httpBatchLink } from '@trpc/client/links/httpBatchLink'
import superjson from 'superjson'
import { ChakraProvider, cookieStorageManagerSSR, extendTheme, ThemeConfig } from '@chakra-ui/react'

// 2. Add your color mode config
const config: ThemeConfig = {
  initialColorMode: 'system',
  useSystemColorMode: true,
}

// 3. extend the theme
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

/**
 * If you want to use SSR, you need to use the server's full URL
 * @link https://trpc.io/docs/ssr
 */
function getBaseUrl() {
  if (process.browser) {
    return ''
  }
  // reference for vercel.com
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  // reference for render.com
  if (process.env.RENDER_INTERNAL_HOSTNAME) {
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`
  }

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    return {
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
      /**
       * @link https://trpc.io/docs/links
       */
      links: [
        // adds pretty logs to your console in development and logs errors in production
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
      /**
       * @link https://trpc.io/docs/data-transformers
       */
      transformer: superjson,
    }
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: true,

  responseMeta({ clientErrors }) {
    if (clientErrors.length) {
      // propagate http first error from API calls
      return {
        status: clientErrors[0].data?.httpStatus ?? 500,
      }
    }

    // for app caching with SSR see https://trpc.io/docs/caching

    return {}
  },
})(MyApp)

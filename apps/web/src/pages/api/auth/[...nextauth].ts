import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from '@/utils/prisma'

export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  adapter: {
    ...PrismaAdapter(prisma),
    // @ts-expect-error simplelogin adds `user` to the data
    linkAccount: ({ user, ...data }) => prisma.account.create({ data }),
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'email' },
        password: { label: 'Password', type: 'password', placeholder: 'password' },
      },
      async authorize(credentials, req) {
        // @todo: auth logic
        return null
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    {
      id: 'simplelogin',
      name: 'SimpleLogin',
      type: 'oauth',
      wellKnown: 'https://app.simplelogin.io/.well-known/openid-configuration',
      authorization: { params: { scope: 'openid email' } },
      idToken: true,
      checks: ['pkce', 'state'],
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
        }
      },
      options: {
        clientId: process.env.SIMPLELOGIN_CLIENT_ID as string,
        clientSecret: process.env.SIMPLELOGIN_CLIENT_SECRET as string,
      },
    },
  ],
})

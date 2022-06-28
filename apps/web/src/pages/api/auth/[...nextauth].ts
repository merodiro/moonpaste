import NextAuth from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from '@/utils/prisma'

export default NextAuth({
  adapter: {
    ...PrismaAdapter(prisma),
    linkAccount: ({ user, ...data }) => prisma.account.create({ data }),
  },
  providers: [
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
  callbacks: {
    session: async ({ session, user }) => {
      session.id = user.id
      return Promise.resolve(session)
    },
  },
})

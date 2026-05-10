import NextAuth from 'next-auth'
import GitLab from 'next-auth/providers/gitlab'
import Google from 'next-auth/providers/google'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitLab({
      clientId: process.env.GITLAB_CLIENT_ID,
      clientSecret: process.env.GITLAB_CLIENT_SECRET,
      issuer: 'https://gitlab.lnu.se',
      authorization: {
        url: 'https://gitlab.lnu.se/oauth/authorize',
        params: { scope: 'read_user' }
      },
      token: 'https://gitlab.lnu.se/oauth/token',
      userinfo: 'https://gitlab.lnu.se/api/v4/user',
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  trustHost: true
})

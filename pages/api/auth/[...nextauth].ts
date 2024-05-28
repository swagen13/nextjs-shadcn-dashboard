import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const config = {
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/signin",
  },
  // clear path from u
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "credentials",
      // The credentials object (e.g. { username: { label: "Username", type: "text "}})
      credentials: {
        uid: { label: "uid", type: "text" },
        email: { label: "Email", type: "text" },
      },
      async authorize(credentials) {
        if (credentials) {
          return {
            id: credentials.uid,
            email: credentials.email,
          };
        } else {
          return null;
        }
      },
    }),
  ],
  session: {
    jwt: true,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async redirect({ redirectUrl }: any) {
      redirectUrl = redirectUrl || "/";
      return redirectUrl;
    },
    async session({ session, token }: any) {
      session = session || {};
      session.user = token.user;
      return session;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.user = user;
      }
      return token;
    },
  },
};

export default NextAuth(config);

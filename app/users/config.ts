import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";

export const config: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "firebase",
      // The credentials object (e.g. { username: { label: "Username", type: "text "}})
      credentials: {
        idToken: { label: "ID Token", type: "text" },
        refreshToken: { label: "Refresh Token", type: "text" },
      },
      async authorize(credentials) {
        console.log("credentials", credentials);
        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      console.log("account", account);
      console.log("profile", profile);
      return true;
    },
  },
};

export default NextAuth(config);

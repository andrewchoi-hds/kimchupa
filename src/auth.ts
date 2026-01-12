import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Demo authentication - in production, verify against database
        if (
          credentials?.email === "demo@kimchupa.com" &&
          credentials?.password === "demo1234"
        ) {
          return {
            id: "demo",
            email: "demo@kimchupa.com",
            name: "김치새싹",
            image: null,
          };
        }

        // For demo purposes, allow any login
        if (credentials?.email && credentials?.password) {
          return {
            id: String(credentials.email).split("@")[0],
            email: String(credentials.email),
            name: String(credentials.email).split("@")[0],
            image: null,
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
});

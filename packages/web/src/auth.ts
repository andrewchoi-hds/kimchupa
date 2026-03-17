import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import type { Provider, OIDCConfig } from "next-auth/providers";
import { authService } from "@kimchupa/api";

// HireVisa OIDC Provider
function HireVisa(): OIDCConfig<{
  sub: string;
  email?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  phone_number?: string;
  university?: { name: string; student_id: string };
}> {
  return {
    id: "hirevisa",
    name: "HireVisa",
    type: "oidc",
    issuer: "https://accounts.hirevisa.com",
    clientId: process.env.HIREVISA_CLIENT_ID,
    clientSecret: process.env.HIREVISA_CLIENT_SECRET,
    authorization: {
      params: {
        scope: "openid email profile",
      },
    },
    checks: ["state", "pkce"],
    profile(profile) {
      return {
        id: profile.sub,
        email: profile.email,
        name: profile.name || [profile.given_name, profile.family_name].filter(Boolean).join(" ") || undefined,
        image: undefined,
      };
    },
  };
}

const providers: Provider[] = [
  Credentials({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        return null;
      }

      const email = String(credentials.email).toLowerCase();
      const password = String(credentials.password);

      const user = await authService.authenticate(email, password);
      if (!user) return null;

      return {
        id: user.id,
        email: user.email,
        name: user.nickname || user.name,
        image: user.image,
      };
    },
  }),
];

// Only add OAuth providers if credentials are configured
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

if (process.env.HIREVISA_CLIENT_ID && process.env.HIREVISA_CLIENT_SECRET) {
  providers.push(HireVisa());
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      // HireVisa SSO: account 정보 저장
      if (account?.provider === "hirevisa") {
        token.provider = "hirevisa";
        // university scope가 있으면 저장
        if (profile && typeof profile === "object" && "university" in profile) {
          token.university = (profile as { university?: { name: string; student_id: string } }).university;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
});

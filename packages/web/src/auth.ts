import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import type { Provider, OAuthConfig } from "next-auth/providers";
import { authService } from "@kimchupa/api";

// HireVisa OAuth Provider (OIDC-compatible, manual config)
function HireVisa(): OAuthConfig<{
  sub: string;
  email?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
}> {
  return {
    id: "hirevisa",
    name: "HireVisa",
    type: "oauth",
    clientId: process.env.HIREVISA_CLIENT_ID,
    clientSecret: process.env.HIREVISA_CLIENT_SECRET,
    authorization: {
      url: "https://accounts.hirevisa.com/oauth/authorize",
      params: {
        scope: "openid email profile",
        response_type: "code",
      },
    },
    token: {
      url: "https://accounts.hirevisa.com/oauth/token",
      async request({ params, provider }: { params: Record<string, unknown>; provider: { callbackUrl: string; clientId?: string; clientSecret?: string } }) {
        const body = new URLSearchParams({
          grant_type: "authorization_code",
          code: params.code as string,
          redirect_uri: provider.callbackUrl,
          client_id: provider.clientId as string,
          client_secret: provider.clientSecret as string,
        });

        const res = await fetch("https://accounts.hirevisa.com/oauth/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: body.toString(),
        });

        const data = await res.json();
        console.log("[HireVisa Token]", res.status, JSON.stringify(data));

        if (!res.ok) {
          throw new Error(`Token exchange failed: ${res.status} ${JSON.stringify(data)}`);
        }

        return { tokens: data };
      },
    },
    userinfo: "https://accounts.hirevisa.com/oauth/userinfo",
    checks: ["state"],
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

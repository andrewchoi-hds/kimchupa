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
        // 이메일/비밀번호 필수 체크
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = String(credentials.email).toLowerCase();
        const password = String(credentials.password);

        // 데모 계정 처리
        if (email === "demo@kimchupa.com" && password === "demo1234") {
          return {
            id: "demo",
            email: "demo@kimchupa.com",
            name: "김치새싹",
            image: null,
          };
        }

        // localStorage 기반 인증은 클라이언트에서 처리
        // 서버에서는 이메일/비밀번호가 있으면 로그인 허용
        // 실제 인증은 authStore에서 수행되고, 여기서는 세션만 생성
        if (email && password) {
          // 이메일에서 닉네임 추출 (기본값)
          const nickname = email.split("@")[0];
          return {
            id: `user_${email.replace(/[^a-z0-9]/gi, "_")}`,
            email: email,
            name: nickname,
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
        token.email = user.email;
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

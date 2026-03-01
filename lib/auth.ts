import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

type Role = "admin" | "technician";

type LoginResponse = {
  accessToken: string;
  user: {
    id: string;
    username: string;
    name: string;
    role: Role;
  };
};

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        const username = credentials?.username?.toString().trim();
        const password = credentials?.password?.toString();
        const role = credentials?.role?.toString() as Role | undefined;

        if (!username || !password || !role) {
          return null;
        }

        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

        if (!apiBaseUrl) {
          return null;
        }

        try {
          const response = await fetch(`${apiBaseUrl}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username,
              password,
              role,
            }),
          });

          if (!response.ok) {
            return null;
          }

          const data = (await response.json()) as LoginResponse;

          if (!data?.accessToken || !data?.user?.id || !data?.user?.role) {
            return null;
          }

          return {
            id: data.user.id,
            name: data.user.name,
            username: data.user.username,
            role: data.user.role,
            accessToken: data.accessToken,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.username = user.username;
        token.accessToken = user.accessToken;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.username = token.username as string;
      }

      session.accessToken = token.accessToken as string;

      return session;
    },
  },
};

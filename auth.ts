import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";

type ProfileRow = {
  id: string;
  email: string;
  password_hash: string;
  username: string | null;
  full_name: string | null;
  role: string;
  avatar_url: string | null;
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Пароль", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = String(credentials.email).toLowerCase().trim();
        const password = String(credentials.password);

        const rows = await sql<ProfileRow[]>`
          SELECT id, email, password_hash, username, full_name, role, avatar_url
          FROM profiles
          WHERE email = ${email}
          LIMIT 1
        `;

        const profile = rows[0];
        if (!profile || !profile.password_hash) return null;

        const ok = await bcrypt.compare(password, profile.password_hash);
        if (!ok) return null;

        return {
          id: profile.id,
          email: profile.email,
          name: profile.full_name ?? profile.username ?? profile.email,
          role: profile.role,
          image: profile.avatar_url,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
});
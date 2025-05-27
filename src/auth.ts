import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth, { NextAuthConfig } from 'next-auth';
import { Adapter } from 'next-auth/adapters';
import Google from 'next-auth/providers/google';

import { generateSlugFromUsername } from '@/actions/auth';
import { db } from '@/lib/prisma';
import { SessionUser } from '@/types/auth';

const options: NextAuthConfig = {
  adapter: {
    ...(PrismaAdapter(db) as Adapter),
    async createUser(user) {
      const slug = await generateSlugFromUsername(user.name!);
      return await db.user.create({
        data: {
          ...user,
          slug,
        },
      });
    },
  },
  session: {
    strategy: 'jwt',
  },
  providers: [Google],
  callbacks: {
    async jwt({ token, user }) {
      if (user as SessionUser) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(options);

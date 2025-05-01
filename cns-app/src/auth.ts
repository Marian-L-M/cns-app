import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import prisma from "../prisma/db";
import { authConfig } from "../auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";

export const config = {
  pages: {
    signIn: "/sign-in",
    signOut: "/sign-out",
    error: "/error",
    verifyRequest: "/verify-request",
    newUser: "/sign-up",
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (credentials == null) return null;

        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });

        if (user && user.password) {
          const isMatch = await compare(
            credentials.password as string,
            user.password
          );

          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }
        // if user doesn't exist or password doesnt match -> null
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, user, trigger, token }: any) {
      // Set user id from token
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name;

      if (trigger === "update") {
        session.user.name = user.name;
      }
      return session;
    },
    async jwt({ token, user, trigger, session }: any) {
      // Assign user fields to token
      if (user) {
        token.role = user.role;

        // If user has no name then use email
        if (user.name === "NO_NAME") {
          token.name = user.email!.split("@")[0];

          // Update database to reflect token name
          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name },
          });
        }
      }

      if (trigger === "signIn" || trigger === "signUp") {
        // const cookiesObject = await cookies();
        // const sessionCartId = cookiesObject.get("sessionCartId")?.value;
        // if (sessionCartId) {
        //   const sessionCart = await prisma.cart.findFirst({
        //     where: { sessionCartId },
        //   });
        //   if (sessionCart) {
        //     // Delete current user cart
        //     await prisma.cart.deleteMany({
        //       where: { userId: user.id },
        //     });
        //     // Assign new cart
        //     await prisma.cart.update({
        //       where: { id: sessionCart.id },
        //       data: { userId: user.id },
        //     });
        //   }
        // }
      }
      // Handle session updates
      if (session?.user.name && trigger === "update") {
        token.name = session.user.name;
      }

      return token;
    },
    authorized({ request, auth }: any) {
      const protectedPaths = [
        /\/maps\/edit/,
        /\/mastermaps/,
        /\/stories\/edit/,
        /\/wiki\/edit/,
        /\/user\/(.*)/,
        /\/users/,
        /\/admin/,
      ];

      const { pathname } = request.nextUrl;

      // Check if unauthorized user
      if (!auth && protectedPaths.some((p) => p.test(pathname))) return false;

      return true;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);

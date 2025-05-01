import type { NextAuthConfig } from "next-auth";
// import { NextResponse } from "next/server";

export const authConfig = {
  providers: [],
  callbacks: {
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

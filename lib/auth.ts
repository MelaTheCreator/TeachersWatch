import type { NextAuthOptions } from "next-auth";

export function isAdmin(session: any) {
  return session?.user?.email === "mela@gmx.de";
}

export function authOptions(session: any): NextAuthOptions {
  return session?.user.name;
}

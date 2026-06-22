import type { DefaultSession } from "next-auth";

// Augment the session type so `session.user.id` is available everywhere.
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
  }
}

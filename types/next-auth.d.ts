import type { UserStatus } from "@/types/user";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "admin" | "technician";
      username: string;
      position?: string;
      status?: UserStatus;
    } & DefaultSession["user"];
    accessToken: string;
  }

  interface User {
    id: string;
    role: "admin" | "technician";
    username: string;
    position?: string;
    status?: UserStatus;
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "admin" | "technician";
    username: string;
    position?: string;
    status?: UserStatus;
    accessToken: string;
  }
}

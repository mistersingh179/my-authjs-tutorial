import { User, Session } from "next-auth";

declare module "next-auth" {
  interface Session {
    userId?: string;
    organizationId?: string;
  }
  interface User extends DefaultUser {
    organizationId: string;
    // Any other attributes you need from either your User table columns or additional fields during a session callback
  }
}
import NextAuth, {Session, User} from "next-auth";
import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import LinkedIn from "@auth/core/providers/linkedin";
import Zoom from "@auth/core/providers/zoom";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/prismaClient";
import sgMail from "@sendgrid/mail";
import Credentials from "@auth/core/providers/credentials";

import {
  adjectives,
  colors,
  uniqueNamesGenerator,
} from "unique-names-generator";
import { JWT } from "@auth/core/jwt";
import { AdapterUser } from "@auth/core/adapters";
import { redirect } from "next/navigation";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signIn",
  },
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Zoom({
      clientId: process.env.ZOOM_CLIENT_ID,
      clientSecret: process.env.ZOOM_CLIENT_SECRET,
    }),
    {
      id: "sendgrid",
      // @ts-ignore
      type: "email",
      async sendVerificationRequest({
        identifier,
        url,
      }: {
        identifier: string;
        url: string;
      }) {
        console.log("url: ", url, identifier);
        const msg = {
          to: identifier,
          from: process.env.SENDGRID_EMAIL_DOMAIN!,
          subject: "Continue Sign-in at Next Auth App",
          text: "Click on this link to continue: " + url,
        };
        const result = await sgMail.send(msg);
      },
    },
    Credentials({
      async authorize(credentials) {
        const { email } = credentials;
        const user = await prisma.user.findFirst({
          where: { email: email as string },
        }) as User;
        return user || null;
      },
    }),
  ],
  callbacks: {
    authorized: (params) => {
      return !!params.auth?.user;
    },
    async session(params) {
      console.log("*** in session callback ***: ", params);
      console.log(Object.keys(params));
      const { session, token } = params as { session: Session; token: JWT };
      if (token.userId) {
        console.log("adding userId to session from token");
        session.userId = token.userId as string;
        session.organizationId = token.organizationId as string;
      }
      return session;
    },
    jwt: async (params) => {
      console.log("*** in jwt token callback ***: ", params);
      const { token, user, account, profile, isNewUser, trigger } = params;
      if (user) {
        console.log("*** got user in jwt token, will add userId to token");
        token.userId = user.id;
        if (user.organizationId) {
          token.organizationId = user.organizationId;
        } else {
          const latestUser = await prisma.user.findFirstOrThrow({
            where: { id: user.id },
          });
          token.organizationId = latestUser.organizationId;
        }
      }
      return token;
    },
  },
  events: {
    createUser: async (message) => {
      const { user } = message;
      console.log("we just created a new user: ", user);
      const randomName = uniqueNamesGenerator({
        dictionaries: [adjectives, colors],
      });
      const organization = await prisma.organization.create({
        data: {
          name: randomName,
          users: {
            connect: {
              id: user.id,
            },
          },
        },
      });
      console.log("also created organization: ", organization);
    },
  },
});

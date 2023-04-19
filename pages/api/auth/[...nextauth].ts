import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../lib/prismadb";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: "710773078828-tp3956dpika4igp0f7upnhu6prslkbrs.apps.googleusercontent.com" || "",
      clientSecret: "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" || "",
    }),
  ],
};

export default NextAuth({
  ...authOptions,
});

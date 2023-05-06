import Head from "next/head";
import Header from "../components/Header";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Footer from "../components/Footer";
import prisma from "../lib/prismadb";
import { User } from "@prisma/client";
import { RoomGeneration } from "../components/RoomGenerator";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { UsersList } from "../components/UserList";

export default function Dashboard({ users }: { users: User[] }) {
  const { data: session } = useSession();
  console.log("users", users);
  return (
    <div className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>Edit my Property Dashboard</title>
      </Head>
      <Header
        photo={session?.user?.image || undefined}
        email={session?.user?.email || undefined}
      />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mb-0 mb-8">
        <h1>Users {session?.user?.email}</h1>
        <UsersList users={users} />
      </main>

      <Footer />
    </div>
  );
}

export async function getServerSideProps(ctx: any) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  if (!session || !session.user) {
    return { props: { rooms: [] } };
  }

  //   console.log("prisma", prisma);

  let users = await prisma.user.findMany({
    // where: {
    //   user: {
    //     email: session.user.email,
    //   },
    // },
    // select: {
    //   inputImage: true,
    //   outputImage: true,
    // },
  });

  return {
    props: {
      users,
    },
  };
}

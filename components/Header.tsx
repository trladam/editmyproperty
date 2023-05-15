import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function Header({
  photo,
  email,
}: {
  photo?: string;
  email?: string;
}) {
  return (
    <header className="flex flex-col xs:flex-row justify-between items-center w-full mt-3 border-b pb-3 sm:px-4 px-2 border-gray-500 gap-2">
      <Link href="/design" className="flex space-x-2">
        <Image alt="header text" src="/logo.png" width={100} height={50} />
        {/* <h1 className="sm:text-3xl text-xl font-bold ml-2 tracking-tight">
          roomGPT.io
        </h1> */}
      </Link>
      {email ? (
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard"
            className="border-r border-gray-300 pr-4 flex space-x-2 hover:text-blue-400 transition"
          >
            <div>Dashboard</div>
          </Link>
          <Link
            href="/design"
            className="border-r border-gray-300 pr-4 flex space-x-2 hover:text-blue-400 transition"
          >
            <div>Design</div>
          </Link>
          <Link
            href="/signup"
            className="border-r border-gray-300 pr-4 flex space-x-2 hover:text-blue-400 transition"
          >
            <div>Signup</div>
            <div className="text-blue-500 bg-blue-200 rounded-full px-2 text-xs flex justify-center items-center font-bold">
              New
            </div>
          </Link>

          <Link
            href="https://gmtcj4wbrcz.typeform.com/to/uMiopxAx" target="_blank"
            className="text-red-500 border-r border-gray-300 pr-4 flex space-x-2 hover:text-blue-400 transition"
          >
            <div>Feedback</div>
          </Link>

          {photo ? (
            <Image
              alt="Profile picture"
              src={photo}
              className="w-10 rounded-full"
              width={32}
              height={28}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-white" />
          )}
          <div
            className="hover:text-blue-400 transition cursor-pointer"
            onClick={() => signOut()}
          >
            Logout
          </div>
        </div>
      ) : (
        <Link
          className="flex max-w-fit items-center justify-center space-x-2 rounded-lg border border-blue-600 text-white px-5 py-2 text-sm shadow-md hover:bg-blue-400 bg-blue-600 font-medium transition"
          href="/design"
        >
          <p>Sign Up </p>
        </Link>
      )}
    </header>
  );
}

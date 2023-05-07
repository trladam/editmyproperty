import { User } from "@prisma/client";
import Image from "next/image";

export function UsersList({ users }: { users: User[] }) {
  console.log("users--->", users);
  return (
    <div className="flex flex-col space-y-10 mt-4 mb-4 border px-8 pb-8 pt-2  rounded-xl">
      <div className="flex  flex-col ">
        <div className="flex flex-col">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <table className="min-w-full text-left text-sm font-light">
                  <thead className="border-b font-medium dark:border-neutral-500">
                    <tr>
                      <th scope="col" className="px-6 py-4">
                        #
                      </th>
                      <th scope="col" className="px-6 py-4"></th>
                      <th scope="col" className="px-6 py-4">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Credits
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users &&
                      users.map((user: User, index: number) => {
                        return (
                          <tr
                            key={index}
                            className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600"
                          >
                            <td className="whitespace-nowrap px-6 py-4 font-medium">
                              {index + 1}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              {user.image && (
                                <Image
                                  alt="Generated room"
                                  width={50}
                                  height={50}
                                  src={user.image}
                                  className="rounded-2xl "
                                />
                              )}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              {user.name}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              {user.email}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              {user.credits}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

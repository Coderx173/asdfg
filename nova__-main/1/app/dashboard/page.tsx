// all files/components in the app directory are automatically use-servers
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

import Sidebar from "../components/sidebar";
import { prisma } from "@/lib/prisma";

// recoil stuff :D 🦾
import { useRecoilState } from "recoil";
import { selectedState } from "../state/atoms/selectedState";
import Serve from "./serve";

// route protected by middleware
export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  const name = session?.user?.name;
  // reading from the database :)
  //   const user = await prisma.user.findFirst({
  //     where: {
  //       email: `${email}`,
  //     },
  //   });
  //   console.log(user);
  return (
    <main>
      <div className="flex">
        <Sidebar email={email} name={name} />
        <div className="flex flex-grow items-center justify-center">
          <Serve />
        </div>
      </div>
    </main>
  );
}

/*
💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀
welcome to the code graveyard...🪦
💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀

<h1 className="bg-black text-white p-5 m-3 rounded">Server Session</h1>
<pre>{JSON.stringify(session)}</pre>
<h1 className="bg-black text-white p-5 m-3 rounded">Client Call</h1>
<User />
*/

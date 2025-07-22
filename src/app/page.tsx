import PostList from "@/components/PostList";
import Sidebar from "@/components/Sidebar";
import { authOptions } from "@/lib/auth/options";
import { getServerSession } from "next-auth";

import { redirect } from "next/navigation";

export default async function Home() {
  const session=await getServerSession(authOptions);
  if(!session){
    redirect("/login");
  }
  return (
    <>
      <div className="w-full sm:w-[90%] lg:w-[70%] mx-auto mt-4 flex flex-col lg:flex-row gap-6 px-2">
        {/* Posts section */}
        
        <main className="w-full lg:w-2/3 h-[calc(100vh-100px)] overflow-y-auto pr-2">
          <PostList />
        </main>

        {/* Sidebar on large screens */}
        <aside className="hidden lg:block w-full lg:w-1/3">
          <Sidebar />
        </aside>
      </div>
    </>
  );
}

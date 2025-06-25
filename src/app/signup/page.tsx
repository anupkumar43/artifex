"use server";

import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import Signup from "~/components/ui/signup";

const Page = async () => {
  const serverSession = await auth();

  if (serverSession?.user) {
    redirect("/dashboard");
  }

  return (
    <div>
      <Signup />
    </div>
  );
};

export default Page;

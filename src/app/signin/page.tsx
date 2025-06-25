"use server";

import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import Signin from "~/components/ui/signin";

const Page = async () => {
  const serverSession = await auth();

  if (serverSession?.user) {
    redirect("/dashboard");
  }

  return (
    <div>
      <Signin />
    </div>
  );
};

export default Page;

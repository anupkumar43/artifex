"use server";

import getServerSession from "next-auth";
import { redirect } from "next/navigation";
import Signup from "~/components/ui/signup";
import { authConfig } from "~/server/auth/config";

const Page = async () => {
  const session = await getServerSession(authConfig);

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div>
      <Signup />
    </div>
  );
};

export default Page;

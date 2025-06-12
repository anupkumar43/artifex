"use server";

import getServerSession from "next-auth";
import { redirect } from "next/navigation";
import Signin from "~/components/ui/signin";
import { authConfig } from "~/server/auth/config";

const Page = async () => {
  const session = await getServerSession(authConfig);

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div>
      <Signin />
    </div>
  );
};

export default Page;

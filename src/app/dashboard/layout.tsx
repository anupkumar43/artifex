// layout.tsx
"use server";

import "~/styles/globals.css";
import { auth } from "~/server/auth";
import Link from "next/link";
import Signout from "~/components/signout";
import { Button } from "~/components/ui/button";
import { db } from "~/server/db";

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const serverSession = await auth();

  if (!serverSession?.user?.id) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gradient-to-b from-[#8d91bc] to-[#ced0eb] text-white">
        <p>You must be signed in to access this page.</p>
      </div>
    );
  }

  const user = await db.user.findUnique({
    where: {
      id: serverSession.user.id,
    },
    select: {
      credits: true,
    },
  });

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#8d91bc] to-[#ced0eb] px-6 py-6">
      <nav className="flex w-full items-center justify-end pb-6">
        <div className="flex items-center gap-4">
          <p>{user?.credits ?? 0} credits left</p>
          <Link href="/dashboard/pricing">
            <Button>Buy more</Button>
          </Link>
          <Signout />
        </div>
      </nav>
      {children}
    </div>
  );
}

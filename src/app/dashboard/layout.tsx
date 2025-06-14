"use server";

import "~/styles/globals.css";

import Link from "next/link";
import Signout from "~/components/signout";
import { Button } from "~/components/ui/button";
import { auth } from "~/auth";
import { db } from "~/server/db";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const serverSession = await auth();
  const user = await db.user.findUnique({
    where: { id: serverSession?.user?.id },
    select: { credits: true },
  });

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-gradient-to-b from-[#646796] to-[#ced0eb] px-6 py-6 text-white">
      {/* Navbar */}
      <nav className="mb-6 w-full max-w-4xl">
        <div className="flex items-center justify-end gap-4 rounded-xl border border-gray-500 p-4 shadow-2xl backdrop-blur-md transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,255,255,0.05)]">
          <p className="text-sm text-gray-200">
            {user?.credits ?? 0} credits left
          </p>
          <Link href="/dashboard/pricing" passHref>
            <Button
              variant="default"
              className="rounded-xl transition-colors hover:bg-gray-100/10"
            >
              Buy more
            </Button>
          </Link>
          <Signout />
        </div>
      </nav>

      {/* Main content */}
      <main className="flex w-full max-w-4xl flex-1 flex-col">{children}</main>
    </div>
  );
}

// page.tsx
"use server";

import Link from "next/link";
import Recent from "~/components/recent";
import Editor from "~/components/editor";
import { Button } from "~/components/ui/button";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

const Page = async () => {
  const serverSession = await auth();

  if (!serverSession?.user?.id) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>You must be signed in to view this page.</p>
      </div>
    );
  }

  const user = await db.user.findUnique({
    where: { id: serverSession.user.id },
    select: { credits: true },
  });

  return (
    <div className="flex w-full items-center justify-center px-4 py-4 md:px-0">
      <div className="flex w-full max-w-4xl flex-col gap-10">
        {user?.credits === 0 ? (
          <div className="flex flex-col px-10 md:mt-10">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
              Hi there 👋
            </h1>
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
              Want to edit a picture?
            </h1>
            <div className="mt-2 flex flex-col gap-3">
              <p className="text-muted-foreground leading-7">
                Buy more credits to continue editing picture.
              </p>
              <Link href="/dashboard/pricing">
                <Button>Buy credits</Button>
              </Link>
            </div>
            <div className="mt-8">
              <Recent />
            </div>
          </div>
        ) : (
          <Editor>
            <Recent />
          </Editor>
        )}
      </div>
    </div>
  );
};
export default Page;

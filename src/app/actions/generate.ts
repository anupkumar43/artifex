"use server";

import { auth } from "~/server/auth";
import { revalidatePath } from "next/cache";
import { db } from "~/server/db";

export const generate = async (): Promise<void> => {
  const serverSession = await auth();

  if (!serverSession?.user?.id) {
    throw new Error("User not authenticated");
  }

  await db.user.update({
    where: {
      id: serverSession.user.id,
    },
    data: {
      credits: {
        decrement: 1,
      },
    },
  });
};

export const refresh = async (): Promise<void> => {
  revalidatePath("/dashboard");
};

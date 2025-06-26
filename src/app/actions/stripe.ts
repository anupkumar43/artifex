"use server";

import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { env } from "~/env";
import { db } from "~/server/db";
import Stripe from "stripe";

export const redirectToBillingSession = async (priceId: string) => {
  if (
    ![env.STRIPE_50_PACK, env.STRIPE_75_PACK, env.STRIPE_100_PACK].includes(
      priceId,
    )
  ) {
    throw new Error("Invalid priceId");
  }

  const serverSession = await auth();

  const user = await db.user.findUnique({
    where: {
      id: serverSession?.user.id,
    },
    select: {
      stripeCustomerId: true,
    },
  });

  if (!user?.stripeCustomerId) {
    throw new Error("User has no stripeCustomerId");
  }

  const stripe = new Stripe(env.STRIPE_SECRET_KEY);

  const session = await stripe.checkout.sessions.create({
    line_items: [{ price: priceId, quantity: 1 }],
    customer: user.stripeCustomerId,
    mode: "payment",
    success_url: `${env.BASE_URL}/api/session-callback`,
  });

  if (!session.url) throw new Error("No session URL");

  redirect(session.url);
};

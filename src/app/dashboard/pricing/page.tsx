"use server";

import Link from "next/link";
import { IoMdArrowBack } from "react-icons/io";
import PricingCard from "~/components/pricing-card";
import { env } from "~/env";

const Page = async () => {
  return (
    <div className="flex w-full items-center justify-center md:h-full">
      <div className="flex flex-col gap-4">
        <Link className="flex items-center gap-2" href="/dashboard">
          <IoMdArrowBack className="h-4 w-4" />
          <p className="leading-7">Go back</p>
        </Link>
        <div className="flex flex-col gap-4 md:flex-row">
          <PricingCard
            priceId={env.STRIPE_50_PACK}
            pricing="₹100"
            credits="50"
          />
          <PricingCard
            priceId={env.STRIPE_75_PACK}
            pricing="₹150"
            credits="75"
          />
          <PricingCard
            priceId={env.STRIPE_100_PACK}
            pricing="₹200"
            credits="100"
          />
        </div>
      </div>
    </div>
  );
};

export default Page;

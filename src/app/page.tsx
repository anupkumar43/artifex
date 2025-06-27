"use server";

import Link from "next/link";
import { Button } from "~/components/ui/button";
import { auth } from "~/server/auth";
import Image from "next/image";
import PricingCard from "~/components/pricing-card";

export default async function HomePage() {
  const user = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center overflow-y-scroll bg-gradient-to-b from-[#eceeff] to-[#f9f9fc] px-6 py-10 text-black">
      {/* Navbar */}
      <nav className="flex w-full max-w-6xl items-center justify-between pb-8">
        <Link href="/" className="text-2xl font-bold text-[#6B4EFF]">
          Artifex
        </Link>
        <div>
          {user?.user ? (
            <Button variant="default">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <Button variant="default">
              <Link href="/signin">Sign In</Link>
            </Button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex w-full max-w-6xl flex-col-reverse items-center justify-between gap-10 md:flex-row">
        {/* Text Section */}
        <div className="max-w-xl text-center md:text-left">
          <h1 className="text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl">
            Instant Magic <br />
            <span className="text-[#A855F7]">One Step Away</span>
          </h1>
          <p className="text-muted-foreground mt-4 text-lg">
            Effortlessly edit your pictures with smart background removal,
            stylish overlays, and pro-level filters — no skills needed.
          </p>
          <Button className="mt-6 w-full md:w-fit" size="lg">
            <Link href={user?.user ? "/dashboard" : "/signup"}>
              {user?.user ? "Go to Dashboard" : "Get a Free Thumbnail"}
            </Link>
          </Button>
        </div>

        {/* Image Section */}
        <Image
          src="/demo.png"
          width={600}
          height={600}
          className="rounded-xl border shadow-lg"
          alt="Image Demo"
          loading="eager"
        />
      </section>

      {/* Pricing Section */}
      <section className="mt-24 w-full max-w-6xl text-center">
        <h2 className="text-3xl font-bold">Pricing</h2>
        <p className="text-muted-foreground mt-2 mb-8">
          Buy credits to unlock premium edits
        </p>
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-center">
          <PricingCard pricing="₹100" credits="50" />
          <PricingCard pricing="₹150" credits="75" />
          <PricingCard pricing="₹200" credits="100" />
        </div>
      </section>
    </main>
  );
}

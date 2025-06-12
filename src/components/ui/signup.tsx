"use client";

import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { signup } from "~/app/actions/auth";
import { signInSchema } from "~/schemas/auth";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import { Label } from "./label";
import { Input } from "./input";
import { Button } from "./button";
import { ArrowLeft } from "lucide-react";

type FormValues = z.infer<typeof signInSchema>;

const Signup = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(signInSchema) });

  const onSubmit = async (data: FormValues) => {
    const error = await signup(data.email, data.password);

    if (error) {
      toast.error(error, {
        description: "Sign up failed",
      });
    } else {
      toast.success("Sign up successful", {
        description: "You can now sign in.",
      });
      router.push("/signin");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1e1b4b] via-[#2e026d] to-[#0f0c29] px-4 py-12 text-white">
      <div className="w-full max-w-md space-y-6">
        <Link
          href="/"
          className="flex items-center text-sm text-white hover:underline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go back
        </Link>

        <Card className="rounded-xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-lg transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,255,255,0.05)]">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8">
            <CardHeader className="mb-6 space-y-1 p-0">
              <CardTitle className="text-3xl font-semibold tracking-tight text-white">
                Sign Up
              </CardTitle>
              <CardDescription className="text-sm text-white/70">
                Enter your credentials below to create a new account.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-5 p-0">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-sm text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="border-white/20 bg-white/10 text-white placeholder-white/40 focus-visible:ring-white"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-400">{errors.email.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password" className="text-sm text-white">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  className="border-white/20 bg-white/10 text-white placeholder-white/40 focus-visible:ring-white"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </CardContent>

            <CardFooter className="mt-6 flex flex-col gap-3 p-0">
              <Button
                type="submit"
                className="w-full bg-white font-medium text-black transition-colors hover:bg-white/90"
              >
                Sign Up
              </Button>
              <Link
                href="/signin"
                className="text-center text-sm text-white/80 hover:underline"
              >
                Already have an account?
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  );
};

export default Signup;

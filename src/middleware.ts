import { auth } from "./auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(req: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard"],
};

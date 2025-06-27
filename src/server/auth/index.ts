import NextAuth from "next-auth";
import { cache } from "react";

import { authConfig } from "./config";

// Destructure handlers from NextAuth
const { auth: baseAuth, handlers, signIn, signOut } = NextAuth(authConfig);

// Memoize the auth function to avoid unnecessary recomputation
const auth = cache(baseAuth);

export { auth, handlers, signIn, signOut };

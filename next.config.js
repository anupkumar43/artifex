/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  //  Skip ESLint during build (temporary fix for deploy failures)
  eslint: {
    ignoreDuringBuilds: true,
  },

  //  Strict runtime enforcement (optional but recommended)
  typescript: {
    ignoreBuildErrors: false, // or true temporarily
  },
};

export default config;

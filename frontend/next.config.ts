import type { NextConfig } from 'next';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH !== undefined
  ? process.env.NEXT_PUBLIC_BASE_PATH
  : '/us/child-tax-credit-calculator';


const nextConfig: NextConfig = {
  ...(basePath ? { basePath } : {}),
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  // Mantine ships CJS interop and relies on browser globals; transpile through
  // Next's pipeline to avoid ESM/CJS mismatch errors during build.
  transpilePackages: ['@mantine/core', '@mantine/hooks'],
  // Pin the workspace root so Turbopack does not silently pick up a stray
  // lockfile from a parent directory during local development or CI.
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;

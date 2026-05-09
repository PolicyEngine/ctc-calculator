import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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

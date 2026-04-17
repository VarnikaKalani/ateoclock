import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/creators",
        destination: "/#creators",
        permanent: false,
      },
    ];
  },
  experimental: {
    useWasmBinary: true,
  },
  reactCompiler: true,
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
